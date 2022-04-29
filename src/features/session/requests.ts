import { AxiosPromise, AxiosResponse } from 'axios';

import axios from '@/lib/axios';

export interface UserSession {
  _id: string;
  email: string;
  expiresAt: number; // seconds
}

const requests = {
  signIn: async ({ email }) => {
    return axios.post('/session', { email });
  },
  signOut: async () => {
    return axios.delete('/session');
  },
  getUserSession: async ({ signal }): Promise<AxiosResponse<UserSession>> => {
    return axios.get('/session', { signal });
  },
  refreshSession: async (): Promise<AxiosResponse<UserSession>> => {
    return axios.get('/session/refresh');
  },
  verifySessionStatus: async ({ token }) => {
    return axios.get(`/session/callback?token=${token}`);
  },
};
export default requests;
