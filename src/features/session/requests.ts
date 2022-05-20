import { AxiosPromise, AxiosResponse } from 'axios';

import axios from '@/lib/axios';

import { UserSession } from './SessionModel';

const sessionApi = {
  signIn: async ({ email }) => {
    return axios.post('/session', { email });
  },
  signOut: async () => {
    return axios.delete('/session');
  },
  getUserSession: async (
    signal,
    params
  ): Promise<AxiosResponse<UserSession>> => {
    return axios.get('/session', params ? { signal, params } : { signal });
  },
  refreshSession: async (): Promise<AxiosResponse<UserSession>> => {
    return axios.get('/session/refresh');
  },
  verifySessionStatus: async ({ token }) => {
    return axios.get(`/session/callback?token=${token}`);
  },
};
export default sessionApi;
