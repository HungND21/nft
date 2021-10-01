export const orderCount = async (FwarMarketDelegate) => {
  const count = await FwarMarketDelegate.orderCount();
  // console.log(count);
  return count;
};
export const getOrderId = async (FwarMarketDelegate) => {
  const countOrder = Number(await orderCount(FwarMarketDelegate));
  let orderId = [];
  for (let i = 0; i < countOrder; i++) {
    orderId[i] = await FwarMarketDelegate.getOrderId(i);
  }
  return orderId;
};

export const getOrderById = async (FwarMarketDelegate) => {
  const arrayOderId = await getOrderId(FwarMarketDelegate);
  let arrayOrder = [];
  for (let i = 0; i < arrayOderId.length; i++) {
    arrayOrder[i] = await FwarMarketDelegate.getOrderById(arrayOderId[i]['orderId']);
  }
  // console.log(Web3.utils.fromWei(orderIdItem['orderId']._hex, 'ether'));

  return arrayOrder;
  // console.log('arrayOderId', arrayOderId);
};
export default { orderCount, getOrderId, getOrderById };
