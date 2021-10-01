import { axiosClient } from './axiosClient';

const OrderApi = {
  getMyOrder(userId) {
    const url = `/order/${userId}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `/order`;
    return axiosClient.post(url, data);
  },
  getAll() {
    const url = `/order`;
    return axiosClient.get(url);
  }
};
export default OrderApi;
