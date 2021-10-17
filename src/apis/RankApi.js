import { axiosClient } from './axiosClient';

const RankApi = {
  getAllRanks() {
    const url = `/rank`;
    return axiosClient.get(url);
  }
};
export default RankApi;
