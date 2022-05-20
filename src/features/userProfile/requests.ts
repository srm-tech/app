import { AxiosPromise, AxiosResponse } from 'axios';

import axios from '@/lib/axios';

import { UserProfile } from '@/features/userProfile1/UserProfileModel';

const requests = {
  getUserProfile: async ({ signal }): Promise<AxiosResponse<UserProfile>> => {
    return axios.get('/userProfile', { signal });
  },
};
export default requests;
