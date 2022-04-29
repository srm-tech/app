import { CheckIcon, MailIcon, UserIcon, XIcon } from '@heroicons/react/solid';
import { AxiosError } from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';

import useRequest from '@/lib/useRequest';

import Spinner from '@/components/Spinner';

import MagicLinkForm from './MagicLinkForm';
import sessionApi, { UserSession } from './requests';
import SignInModal from './SignInModal';

interface Session {
  status: 'unauthenticated' | 'authenticated';
  isActive: boolean;
  isLoading: boolean;
  isPolling: boolean;
  isTimedOut: boolean;
  error: string;
  data: UserSession;
}

interface ContextProps extends Session {
  showLoginModal: () => void;
  signIn: ({ email: string }) => void;
  signOut: ({ callbackUrl }: { callbackUrl: string }) => void;
}

const defaultValue: Session = {
  status: 'unauthenticated',
  isActive: false,
  isLoading: false,
  isPolling: false,
  isTimedOut: false,
  error: '',
  data: { email: '', _id: '', expiresAt: 30 * 60 },
};

const SessionContext = React.createContext<ContextProps>({
  ...defaultValue,
  signIn: () => {},
  signOut: () => {},
  showLoginModal: () => {},
});
const { Provider } = SessionContext;

export const SessionProvider = ({ children }) => {
  const userSessionRequest = useRequest<UserSession>(sessionApi.getUserSession);
  const [session, setSession] = useState<Session>(defaultValue);
  const [showModal, setShowModal] = useState(false);

  const intervalRef = useRef<any>();
  const timeoutRef = useRef<any>();
  const timeoutRefreshRef = useRef<any>();

  const setNewSession = (newSession: Partial<Session>) => {
    setSession((prevSession) => ({
      ...prevSession,
      ...newSession,
    }));
  };

  const showLoginModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setNewSession({
      isLoading: false,
      isPolling: false,
      isTimedOut: false,
      error: '',
    });
    cleanup();
    setShowModal(false);
  };

  const checkSession = async () => {
    const result = await userSessionRequest.run();
    if (result) {
      setNewSession({
        data: result,
        status: 'authenticated',
        isActive: true,
        isLoading: false,
        isPolling: false,
      });
      setRefreshTimeout(result?.expiresAt);
      // set to default interval
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    }
    return result;
  };

  const checkSessionPolling = ({ interval }) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      checkSession();
    }, interval);
  };

  const signIn = async ({ email }) => {
    setNewSession({ isLoading: true, error: '' });
    try {
      await sessionApi.signIn({ email });
      setNewSession({ isPolling: true, isLoading: false });
      checkSessionPolling({ interval: 2 * 1000 });
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        // kill polling after 1hr -> set as fail
        setNewSession({
          isLoading: false,
          isPolling: false,
          error: 'Session check time out. Please try again.',
        });
        clearInterval(intervalRef.current);
      }, 10 * 60 * 1000); // 10 min
    } catch (error) {
      // handle Axios error, tap on the response data for validation error message if any
      setNewSession({
        error:
          (error as AxiosError)?.response?.data?.message ||
          (error as Error).message,
        isLoading: false,
      });
    }
  };

  const signInAgain = async () => {
    setNewSession(defaultValue);
  };

  const signOut = async () => {
    setNewSession(defaultValue);
    cleanup(true);
    await sessionApi.signOut();
  };
  const timeOut = async () => {
    await sessionApi.signOut();
    setNewSession({ ...defaultValue, isTimedOut: true });
    cleanup(true);
  };

  const setRefreshTimeout = async (expiresAt) => {
    clearTimeout(timeoutRefreshRef.current);
    if (expiresAt) {
      console.info('next refresh at: ', expiresAt);
      const expiresIn = expiresAt * 1000 - Date.now() - 5000; // subtract 5s from timeout to perform auto refresh before expiry
      timeoutRefreshRef.current = setTimeout(async () => {
        if (!session.isTimedOut) {
          try {
            const { data } = await sessionApi.refreshSession();
            // set next refresh call with new expiry
            setRefreshTimeout(data.expiresAt);
          } catch (error) {
            // fail means we set default state -> logout
            await timeOut();
            setTimeout(() => {
              setShowModal(true);
            });
          }
        }
      }, expiresIn); // minus ten seconds padding for refresh request
    }
  };

  const submit = async ({ email }) => {
    signIn({ email });
  };

  const cleanup = (clearRefreshTimeout = false) => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    if (clearRefreshTimeout) {
      clearTimeout(timeoutRefreshRef.current);
    }
    userSessionRequest.cancel();
  };

  const loadData = async () => {
    setNewSession({
      isLoading: true,
    });
    const result = await checkSession();
    if (!result) {
      // try refreshing session
      try {
        const { data } = await sessionApi.refreshSession();
        setRefreshTimeout(data.expiresAt);
        checkSession();
      } catch (error) {
        // logout
        signOut();
      }
    }
  };

  useEffect(() => {
    // ignore loading session data when user lands on verify page from email link
    if (window.location.pathname.includes('/session/verify')) {
      return;
    }
    if (showModal) {
      loadData();
    }
    return () => {
      cleanup();
    };
    // if user session is ok and user opens modal -> sign user
  }, [showModal]);

  return (
    <Provider value={{ ...session, signIn, signOut, showLoginModal }}>
      {showModal && (
        <SignInModal
          open={showModal}
          onClose={closeModal}
          showCloseButton={true}
        >
          <div className='relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
            {session.isLoading && (
              <div className='absolute top-0 left-0 w-full h-full bg-white flex items-center justify-center'>
                <div>
                  <Spinner />
                </div>
              </div>
            )}
            {!session.isTimedOut && !session.isActive && session.isPolling && (
              <div className='space-y-4'>
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
                  <MailIcon
                    className='h-6 w-6 text-green-600 animate-pulse'
                    aria-hidden='true'
                  />
                </div>
                <div className='text-center sm:mt-5'>
                  <div className='text-lg leading-6 font-medium text-gray-500'>
                    Confirm your email
                  </div>
                </div>
              </div>
            )}
            {!session.isTimedOut && !session.isActive && !session.isPolling && (
              <div className='space-y-4'>
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100'>
                  <UserIcon
                    className='h-6 w-6 text-gray-600'
                    aria-hidden='true'
                  />
                </div>
                {session.error && (
                  <p className='text-red-500 text-xs'>{session.error}</p>
                )}
                <MagicLinkForm onSubmit={submit} />
              </div>
            )}

            {!session.isTimedOut && session.isActive && (
              <div className='space-y-4'>
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
                  <CheckIcon
                    className='h-6 w-6 text-green-600'
                    aria-hidden='true'
                  />
                </div>
                <div className='text-center sm:mt-5'>
                  <div className='text-lg leading-6 font-medium text-gray-500'>
                    Successfully signed in!
                  </div>
                </div>
                <button
                  type='button'
                  className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
                  onClick={closeModal}
                >
                  Continue to app
                </button>
              </div>
            )}

            {session.isTimedOut && (
              <div className='space-y-4'>
                <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100'>
                  <XIcon
                    className='h-6 w-6 text-yellow-600'
                    aria-hidden='true'
                  />
                </div>
                <div className='text-center sm:mt-5'>
                  <div className='text-lg leading-6 font-medium text-gray-500'>
                    Your session has ended
                  </div>
                </div>
                <button
                  type='button'
                  className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
                  onClick={signInAgain}
                >
                  Sign in again
                </button>
              </div>
            )}
          </div>
        </SignInModal>
      )}
      {children}
    </Provider>
  );
};

export const useSession = () => {
  const session = useContext(SessionContext);
  return session;
};
