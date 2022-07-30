import { AxiosResponse } from 'axios';

import axios from '@/lib/axios';

import { Order } from './OrderModel';

const orderApi = {
  createOrder: async (signal, payload) => {
    return axios.post(`/Orders`, payload, { signal });
  },
  getOrder: async (signal, id): Promise<AxiosResponse<Order> | any> => {
    return axios.get(`/Orders/${id}`, { signal });
  },
  updateOrder: async (signal, data): Promise<AxiosResponse<Order> | any> => {
    return axios.put(`/Orders/${data._id}`, data, { signal });
  },
};
export default orderApi;
