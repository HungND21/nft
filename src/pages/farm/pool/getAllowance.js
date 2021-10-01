import { ethers } from 'ethers';
import React from 'react';
import FBNBUSD from './FBNB-Usdt';

function GetAllowance(account) {
  const LPBNBUsdtContract = new ethers.Contract(FBNBUSD.address, FBNBUSD.abi);
  const [x, setX] = React.useState(false);
  React.useEffect(() => {
    const init = async () => {
      const allowance = await LPBNBUsdtContract.allowance(
        'a',
        '0xea85f5A3123Fd1F067FA44c5D84DD8D9c06F3d48' // address fwar pool
      );
      allowance && allowance > 0 ? setX(true) : setX(false);
    };
    init();
  }, []);

  return x;
}

export default GetAllowance;
