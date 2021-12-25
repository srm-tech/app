import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider, CachePolicies } from 'use-http';
import { env } from '../config';

import '@/styles/globals.css';
import '@/styles/roadmap.scss';

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
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
