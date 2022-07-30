import { AxiosPromise, AxiosResponse } from 'axios';
import Stripe from 'stripe';

import axios from '@/lib/axios';

import { Introduction } from './IntroductionModel';

const introductionApi = {
  createIntroduction: async (signal, payload) => {
    return axios.post(`/introductions`, payload, { signal });
  },
  searchIntroductions: async (
    signal,
    params
  ): Promise<AxiosResponse<Introduction> | any> => {
    return await axios.get(`/introductions`, { signal, params });
    // const newData = data.map((item: Introduction) => ({
    //   ...item,
    //   createdAt: new Date(item.createdAt).toLocaleDateString(),
    //   commissionAmount:
    //     item.commissionType === CommissionType.fixed
    //       ? item.commissionAmount?.toLocaleString('en-AU', {
    //           style: 'currency',
    //           currency: item?.commissionCurrency || 'AUD',
    //         })
    //       : `${item.commissionAmount}%`,
    // }));
    // return { data: newData[0] };
  },
  getIntroduction: async (
    signal,
    id
  ): Promise<AxiosResponse<Introduction> | any> => {
    return axios.get(`/introductions/${id}`, { signal });
  },
  updateIntroduction: async (
    signal,
    data
  ): Promise<AxiosResponse<Introduction> | any> => {
    return axios.put(`/introductions/${data._id}`, data, { signal });
  },
  getQuote: async (
    signal,
    params
  ): Promise<AxiosResponse<Introduction> | any> => {
    if (!params.id) return null;
    return axios.get(
      `/introductions/${params.id}/quote?dealValue=${params.dealValue}`,
      { signal }
    );
  },
  getPaymentSession: async (
    signal,
    params
  ): Promise<AxiosResponse<Stripe.Checkout.Session> | any> => {
    return axios.get(
      `/introductions/${params.id}/payment?dealValue=${params.dealValue}`,
      {
        signal,
      }
    );
  },
};
export default introductionApi;
