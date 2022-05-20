import { AxiosResponse } from 'axios';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import useFetch, { CachePolicies, Provider } from 'use-http';
import { useStore } from 'zustand';

import '@/styles/globals.css';
import '@/styles/roadmap.scss';

import axios from '@/lib/axios';
import { env } from '@/lib/envConfig';
import useRequest from '@/lib/useRequest';

import ButtonLink from '@/components/links/ButtonLink';
import Modal from '@/components/modals/ConfirmModal';
import RegisterForm from '@/components/RegisterForm';

// import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { SessionProvider, useSession } from '@/features/session/SessionContext';
import { UserProfile } from '@/features/userProfile/requests';
import userProfileApi from '@/features/userProfile1/requests';
import userProfileStore from '@/features/userProfile1/userStore';

// const CheckSession = () => {
//   const { get, response, loading, error } = useFetch('');
//   const router = useRouter();
//   const userSession = useSession();
//   const [open, setOpen] = useState(false);
//   const loadData = async () => {
//     await get(`/me`);
//     if (response.ok && !response.data?.isActive) {
//       return setOpen(true);
//     }
//   };
//   useEffect(() => {
//     if (userSession.status === 'loading') return;
//     if (userSession.status === 'authenticated') {
//       loadData();
//     }
//   }, [userSession]);
//   if (userSession.status === 'loading') {
//     return null;
//   }

//   return (
//     <>
//       <Modal
//         isShowing={
//           userSession.status === 'unauthenticated' &&
//           window.location.pathname.startsWith('/app')
//         }
//         acceptCaption='Sign In'
//         cancelCaption='Close'
//         onAccept={() => signIn()}
//         onCancel={() => router.replace('/')}
//         caption='Session Timeout'
//         content={
//           <div>
//             <p>Your session has ended</p>
//           </div>
//         }
//       />
//       <Modal
//         isShowing={open}
//         form='registration'
//         acceptCaption='Register Now'
//         cancelCaption='Continue as guest'
//         onAccept={() => console.info('register')}
//         onCancel={() => setOpen(false)}
//         caption='New to Introduce Guru?'
//         content={
//           <div>
//             <p>
//               Almost there, please provide profile info for the introduction.
//             </p>
//             <RegisterForm
//               email={userSession.data?.user?.email || ''}
//               onComplete={() => setOpen(false)}
//             />
//           </div>
//         }
//       />
//     </>
//   );
// };

const LoadUser = () => {
  const router = useRouter();
  const session = useSession();
  const userProfile = userProfileStore((state) => state.userProfile);
  useRequest<UserProfile>(userProfileApi.getUserProfile, {
    dependencies: [session.isActive],
    onSuccess: (data) => {
      userProfileStore.setState({ userProfile: data, isLoading: false });
    },
  });
  const setInterceptor = useCallback(async (error) => {
    const response: AxiosResponse = error.response;
    if ([401].includes(response?.status)) {
      console.info('Logging user out on 401');
      if (userProfile) {
        userProfileStore.setState({
          userProfile: undefined,
          isLoading: false,
        });
        toast.error('Your session has ended. Sign in again to continue.');
      }
      if (router.pathname !== '/') {
        router.replace('/');
      }
    }
  }, []);

  useEffect(() => {
    axios.interceptors.response.use((response) => response, setInterceptor);
  }, []);

  return null;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const options = {
    cachePolicy: CachePolicies.NO_CACHE,
    interceptors: {
      // every time we make an http request, this will run 1st before the request is made
      // url, path and route are supplied to the interceptor
      // request options can be modified and must be returned
      // request: async ({ options, url, path, route }) => {
      //   return options;
      // },
      // every time we make an http request, before getting the response back, this will run
      response: async ({ response }) => {
        const res = response;
        return res;
      },
    },
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: false,
      },
    },
  });

  return (
    <Provider url={`${env.BASE_URL}/api`} options={options}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <LoadUser />
          <Component {...pageProps} />
        </SessionProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
function userRef(arg0: boolean) {
  throw new Error('Function not implemented.');
}
