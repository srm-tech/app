import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useFetch, { CachePolicies, Provider } from "use-http";

import "@/styles/globals.css";
import "@/styles/roadmap.scss";

import { env } from "@/lib/envConfig";

import ButtonLink from "@/components/links/ButtonLink";
import Modal from "@/components/modals/ConfirmModal";
import RegisterForm from "@/components/RegisterForm";

const CheckSession = () => {
  const { get, response, loading, error } = useFetch("");
  const router = useRouter();
  const userSession = useSession();
  const [open, setOpen] = useState(false);
  const loadData = async () => {
    await get(`/me`);
    if (response.ok && !response.data?.isActive) {
      return setOpen(true);
    }
  };
  useEffect(() => {
    if (userSession.status === "loading") return;
    if (userSession.status === "authenticated") {
      loadData();
    }
  }, [userSession]);
  if (userSession.status === "loading") {
    return null;
  }

  return (
    <>
      <Modal
        isShowing={
          userSession.status === "unauthenticated" &&
          window.location.pathname.startsWith("/app")
        }
        acceptCaption="Sign In"
        cancelCaption="Close"
        onAccept={() => signIn()}
        onCancel={() => router.replace("/")}
        caption="Session Timeout"
        content={
          <div>
            <p>Your session has ended</p>
          </div>
        }
      />
      <Modal
        isShowing={open}
        form="registration"
        acceptCaption="Register Now"
        cancelCaption="Continue as guest"
        onAccept={() => console.info("register")}
        onCancel={() => setOpen(false)}
        caption="New to Introduce Guru?"
        content={
          <div>
            <p>
              Almost there, please provide profile info for the introduction.
            </p>
            <RegisterForm
              email={userSession.data?.user?.email || ""}
              onComplete={() => setOpen(false)}
            />
          </div>
        }
      />
    </>
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
