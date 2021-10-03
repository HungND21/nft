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
  getAll({ page, rarity, element, teamId, level, typeCard }) {
    rarity = rarity && rarity.value ? rarity.value : '';
    element = element && element.value ? element.value : '';
    teamId = teamId && teamId.value ? teamId.value : '';
    level = level ? level : '';
    typeCard = typeCard && typeCard.value ? typeCard.value : '';
    const url = `/order?&_page=${page}&_rarity=${rarity}&_element=${element}&_teamId=${teamId}&_level=${level}&_cardType=${typeCard}`;
    return axiosClient.get(url);
  }
};
export default OrderApi;
