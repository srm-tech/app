import { CheckIcon, MailIcon, UserIcon, XIcon } from '@heroicons/react/solid';
import { AxiosError } from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';

import useRequest from '@/lib/useRequest';

import Spinner from '@/components/Spinner';

import MagicLinkForm from './MagicLinkForm';
import sessionApi from './requests';
import { UserSession } from './SessionModel';
import SignInModal from './SignInModal';

interface Session {
  status: 'unauthenticated' | 'authenticated';
  isActive: boolean;
  isLoading: boolean;
  isPolling: boolean;
  isRefreshing: boolean;
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
  isLoading: true,
  isPolling: false,
  isRefreshing: false,
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
  const getUserSession = useRequest<
    UserSession,
    { token: string; email: string }
  >(sessionApi.getUserSession);
  const [session, setSession] = useState<Session>(defaultValue);
  const [showModal, setShowModal] = useState(false);

  const pollingIntervalRef = useRef<any>();
  const pollingTimeoutRef = useRef<any>();
  const refreshIntervalRef = useRef<any>();

  // utility to manipulate single session object with partial updates
  const setNewSession = (newSession: Partial<Session>) => {
    setSession((prevSession) => ({
      ...defaultValue,
      ...prevSession,
      ...newSession,
    }));
  };

  // modal has 3 states: not logged, pooling and logged
  const showLoginModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    stopPolling();
    setShowModal(false);
  };

  // check session by sending cookies to backend
  const checkSession = async (email?: string, token?: string) => {
    // ignore loading session data when user lands on verify page from email link
    if (window.location.pathname.includes('/session/verify')) {
      return;
    }
    const result = await getUserSession.run(
      (email &&
        token && {
          email: `${email}`,
          token: `${token}`,
        }) ||
        undefined
    );

    if (result?._id) {
      setNewSession({
        data: result,
        status: 'authenticated',
        isActive: true,
        isLoading: false,
      });
    }
    return result;
  };

  // Polling for activation link verification
  const stopPolling = () => {
    setNewSession({ isPolling: false });
    clearInterval(pollingIntervalRef.current);
  };
  const startPolling = ({ interval, email, token }) => {
    stopPolling();
    setNewSession({ isPolling: true });
    pollingIntervalRef.current = setInterval(async () => {
      checkSession(email, token);
    }, interval);
  };

  // polling switch
  const stopPollingTimeout = () => {
    clearTimeout(pollingTimeoutRef.current);
    setNewSession({ isTimedOut: false });
  };
  const setPollingTimeout = (min) => {
    stopPollingTimeout();
    pollingTimeoutRef.current = setTimeout(() => {
      setNewSession({ isTimedOut: true });
      stopPolling;
    }, min * 60 * 1000);
  };

  // Silent session Refresh
  const stopRefreshing = () => {
    setNewSession({ isRefreshing: false });
    clearInterval(refreshIntervalRef.current);
  };
  const startRefreshing = ({ interval }) => {
    setNewSession({ isRefreshing: true });
    stopRefreshing();
    refreshIntervalRef.current = setInterval(async () => {
      sessionApi.refreshSession();
    }, interval);
  };

  // send email link
  // start polling
  const signIn = async ({ email }) => {
    setNewSession({ isLoading: true, error: '' });
    stopRefreshing();
    stopPolling();
    // kill polling after 10min
    setPollingTimeout(10);
    try {
      const { data: token } = await sessionApi.signIn({ email });
      startPolling({
        interval: 2000,
        email,
        token,
      });
    } catch (error) {
      stopPolling();
      // handle Axios error, tap on the response data for validation error message if any
      setNewSession({
        error:
          (error as AxiosError)?.response?.data?.message ||
          (error as Error).message,
      });
    } finally {
      setNewSession({ isLoading: false });
    }
  };
  const signInAgain = async () => {
    // clean state so user can enter email again in inactive state
    setNewSession(defaultValue);
  };
  const submit = async ({ email }) => {
    signIn({ email });
  };

  const signOut = async () => {
    setNewSession(defaultValue);
    stopPolling();
    stopRefreshing();
    await sessionApi.signOut();
  };

  const init = () => {
    checkSession();
  };

  useEffect(() => {
    init();
    window.addEventListener('focus', init);
    return () => {
      stopPolling();
      window.removeEventListener('focus', init);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      init();
    }
  }, [showModal]);

  // awaiting result from polling and if active -> stop it
  useEffect(() => {
    if (session.isActive) {
      stopPolling();
      // subtract 5s from timeout to perform auto refresh before expiry });
      startRefreshing({
        interval: Math.max(
          session.data.expiresAt * 1000 - Date.now() - 5000,
          1000
        ),
      });
    }
  }, [session.isActive]);

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
