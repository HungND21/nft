export const rarityDropdown = [
  // { value: '', label: 'All' },
  { value: '1', label: 'Junk' },
  { value: '2', label: 'Normal' },
  { value: '3', label: 'Rare' },
  { value: '4', label: 'Epic' }
  // { value: '5', label: 'Legend' }
];

export const elementDropdown = [
  // { value: '', label: 'All' },
  { value: '1', label: 'Metal' },
  { value: '2', label: 'Wood' },
  { value: '3', label: 'Water' },
  { value: '4', label: 'Fire' },
  { value: '5', label: 'Earth' }
];
export const cardTypeDropdown = [
  { value: 'attacker', label: 'Attacker' },
  { value: 'defender', label: 'Defender' }
];
// export const orderCount = async (FwarMarketDelegate) => {
//   const count = await FwarMarketDelegate.orderCount();
//   // console.log(count);
//   return count;
// };
// export const getOrderId = async (FwarMarketDelegate) => {
//   const countOrder = Number(await orderCount(FwarMarketDelegate));
//   let orderId = [];
//   for (let i = 0; i < countOrder; i++) {
//     orderId[i] = await FwarMarketDelegate.getOrderId(i);
//   }
//   return orderId;
// };

// export const getOrderById = async (FwarMarketDelegate) => {
//   const arrayOderId = await getOrderId(FwarMarketDelegate);
//   let arrayOrder = [];
//   for (let i = 0; i < arrayOderId.length; i++) {
//     arrayOrder[i] = await FwarMarketDelegate.getOrderById(arrayOderId[i]['orderId']);
//   }
//   // console.log(Web3.utils.fromWei(orderIdItem['orderId']._hex, 'ether'));

//   return arrayOrder;
//   // console.log('arrayOderId', arrayOderId);
// };
// export default { orderCount, getOrderId, getOrderById };
