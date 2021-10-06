import { axiosClient } from './axiosClient';

const UserApi = {
  add(data) {
    const url = `/character`;
    return axiosClient.post(url, data);
  },
  getMyList({ userId, page, rarity, element, teamId, typeCard, level, isListed }) {
    // character?_userId=6154b18b08495c9b6ccaa330&_page=1&_rarity=4&_element=1
    console.log('teamId', teamId);
    page = page ? page : '';
    isListed = isListed !== undefined ? isListed : '';

    rarity = rarity && rarity.value ? rarity.value : '';

    element = element && element.value ? element.value : '';
    teamId = teamId && teamId.id ? teamId.id : '';
    level = level ? level : '';
    typeCard = typeCard && typeCard.value ? typeCard.value : '';

    const url = `/character?_userId=${userId}&_page=${page}&_rarity=${rarity}&_element=${element}&_teamId=${teamId}&_level=${level}&_cardType=${typeCard}&_isListed=${isListed}`;
    return axiosClient.get(url);
  },
  getOne(nftId) {
    const url = `/character/${nftId}`;
    return axiosClient.get(url);
  }
};
export default UserApi;
