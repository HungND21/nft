import { axiosClient } from './axiosClient';

const UserApi = {
  add(data) {
    const url = `/character`;
    return axiosClient.post(url, data);
  },
  getMyList(userId, page) {
    const url = `/character?_userId=${userId}&_page=${page}`;
    return axiosClient.get(url);
  },
  getOne(nftId) {
    const url = `/character/${nftId}`;
    return axiosClient.get(url);
  }
};
export default UserApi;
