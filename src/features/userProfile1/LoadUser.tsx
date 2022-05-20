import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

import axios from '@/lib/axios';
import useRequest from '@/lib/useRequest';

// import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { SessionProvider, useSession } from '@/features/session/SessionContext';
import userProfileApi from '@/features/userProfile1/requests';
import { UserProfile } from '@/features/userProfile1/UserProfileModel';
import userProfileStore from '@/features/userProfile1/userStore';

export const LoadUser = ({ children }) => {
  const router = useRouter();
  const session = useSession();
  const userProfile = userProfileStore((state) => state.userProfile);
  const getUserProfile = useRequest<UserProfile>(
    userProfileApi.getUserProfile,
    {
      onSuccess: (data) => {
        userProfileStore.setState({ userProfile: data, isLoading: false });
      },
    }
  );
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

  const loadData = async () => {
    if (session.isActive) {
      const result = await getUserProfile.run();
      if (!result?.isComplete && router.pathname !== '/app/register') {
        router.replace('/app/register');
      }
    }
  };

  useEffect(() => {
    axios.interceptors.response.use((response) => response, setInterceptor);
  }, []);

  useEffect(() => {
    loadData();
  }, [session.isActive]);

  return (session.isLoading || getUserProfile.isLoading) &&
    router.pathname.includes('/app') ? (
    <div>loading...</div>
  ) : (
    children
  );
};
