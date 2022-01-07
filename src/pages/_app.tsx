import { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import useFetch, { Provider, CachePolicies } from 'use-http';
import Modal from '@/components/modals/ConfirmModal';
import RegisterForm from '@/components/RegisterForm';
import { env } from '@/lib/envConfig';

import '@/styles/globals.css';
import '@/styles/roadmap.scss';
import { useEffect, useState } from 'react';

const CheckSession = () => {
  const { get, response, loading, error } = useFetch('');
  const userSession = useSession();
  const [open, setOpen] = useState(false);
  const loadData = async () => {
    await get(`/me`);
    if (response.ok && !response.data) {
      return setOpen(true);
    }
  };
  useEffect(() => {
    if (userSession.status === 'loading') return;
    if (userSession.status === 'authenticated') {
      loadData();
    }
  }, [userSession]);
  if (userSession.status === 'loading') {
    return null;
  }

  return (
    <Modal
      isShowing={open}
      form='registration'
      acceptCaption='Register Now'
      cancelCaption='Continue as guest'
      accept={() => console.info('register')}
      cancel={() => setOpen(false)}
      caption='New to Introduce Guru?'
      content={
        <div>
          <p>Almost there, please provide profile info for the introduction.</p>
          <RegisterForm
            email={userSession.data?.user?.email || ''}
            onComplete={() => setOpen(false)}
          />
        </div>
      }
    />
  );
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

  return (
    <Provider url={`${env.BASE_URL}/api`} options={options}>
      <SessionProvider session={session}>
        <CheckSession />
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
