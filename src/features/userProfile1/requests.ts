import { AxiosPromise, AxiosResponse } from 'axios';

import axios from '@/lib/axios';

import { UserProfile } from '@/features/userProfile1/UserProfileModel';

import { CommissionType } from '../agreements/agreementConstants';
import { Commission } from '../agreements/AgreementModel';

const userProfileApi = {
  createUserProfile: async (
    signal,
    payload
  ): Promise<AxiosResponse<UserProfile> | any> => {
    return axios.post(`/userProfile`, payload, { signal });
  },
  searchUserProfile: async (
    signal,
    params
  ): Promise<AxiosResponse<UserProfile> | any> => {
    if (params.q.length <= 1) {
      return { data: [] };
    }
    return axios.get(`/userProfile`, { signal, params });
  },
  getUserProfile: async (signal): Promise<AxiosResponse<UserProfile> | any> => {
    return axios.get(`/userProfile/me`, { signal });
  },
  getUserProfileCommission: async (
    signal,
    params
  ): Promise<AxiosResponse<UserProfile> | any> => {
    if (!params.businessId) {
      return null;
    }
    const { data } = await axios.get(
      `/userProfile/${params.businessId}/commission`,
      {
        signal,
      }
    );
    const newData = data.map((item: Commission) => ({
      ...item,
      commissionAmount:
        item.commissionType === CommissionType.fixed
          ? item.commissionAmount?.toLocaleString('en-AU', {
              style: 'currency',
              currency: item?.commissionCurrency || 'AUD',
            })
          : `${item.commissionAmount}%`,
    }));
    return { data: newData[0] };
  },
  updateUserProfile: async (
    signal,
    data
  ): Promise<AxiosResponse<UserProfile> | any> => {
    return axios.put(`/userProfile/me`, data, { signal });
  },
};
export default userProfileApi;
