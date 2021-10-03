import { axiosClient } from './axiosClient';

const UserApi = {
  add(data) {
    const url = `/character`;
    return axiosClient.post(url, data);
  },
  getMyList({ userId, page, rarity, element, teamId, typeCard, level }) {
    // character?_userId=6154b18b08495c9b6ccaa330&_page=1&_rarity=4&_element=1
    console.log('userId', userId);
    rarity = rarity && rarity.value ? rarity.value : '';
    element = element && element.value ? element.value : '';
    teamId = teamId && teamId.value ? teamId.value : '';
    level = level ? level : '';
    typeCard = typeCard && typeCard.value ? typeCard.value : '';
    console.log(typeCard);
    const url = `/character?_userId=${userId}&_page=${page}&_rarity=${rarity}&_element=${element}&_teamId=${teamId}&_level=${level}&_cardType=${typeCard}`;
    return axiosClient.get(url);
  },
  getOne(nftId) {
    const url = `/character/${nftId}`;
    return axiosClient.get(url);
  }
};
export default UserApi;
