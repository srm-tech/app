import { AxiosPromise, AxiosResponse } from 'axios';

import axios from '@/lib/axios';

import { CommissionType } from './agreementConstants';
import { Agreement } from './AgreementModel';

export interface AgreementInput {
  guruId: string;
  businessId: string;
}

const agreementApi = {
  createAgreement: async (
    signal,
    payload
  ): Promise<AxiosResponse<Agreement> | any> => {
    return axios.post(`/agreements`, payload, { signal });
  },
  searchAgreement: async (
    signal,
    params: AgreementInput | undefined
  ): Promise<AxiosResponse<Agreement> | any> => {
    if (!params?.guruId || !params?.businessId) {
      return null;
    }
    const { data } = await axios.get(`/agreements`, { signal, params });
    return { data: data[0] };
  },
  getAgreement: async (signal, id): Promise<AxiosResponse<Agreement> | any> => {
    return axios.get(`/agreements/${id}`, { signal });
  },
  updateAgreement: async (
    signal,
    data
  ): Promise<AxiosResponse<Agreement> | any> => {
    return axios.put(`/agreements/${data._id}`, data, { signal });
  },
};
export default agreementApi;
