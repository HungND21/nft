import { ethers } from 'ethers';
import FwarCharJson from 'contracts/FwarChar/FWarChar.json';
import FwarCharDelegateJson from 'contracts/FwarChar/FwarCharDelegate.json';
import FwarMarketDelegateJson from 'contracts/FwarMarket/FwarMarketDelegate.json';
import Usdt from 'contracts/Usdt.json';

export const getEthersContract = (address, abi) => {
  // Modern dapp browsers...
  if (window.ethereum) {
    try {
      // Request account access if needed
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      return new ethers.Contract(address, abi, signer);
      // Accounts now exposed
    } catch (error) {
      console.log(error);
      return;
    }
  }
};
export const networkChainId = (contract, chainId) => {
  return contract.networks[chainId].address;
};
export const FwarChar = getEthersContract(networkChainId(FwarCharJson, 97), FwarCharJson.abi);
export const FwarCharDelegate = getEthersContract(
  networkChainId(FwarCharDelegateJson, 97),
  FwarCharDelegateJson.abi
);

export const FwarMarketDelegate = getEthersContract(
  networkChainId(FwarMarketDelegateJson, 97),
  FwarMarketDelegateJson.abi
);
export const USDT = getEthersContract(networkChainId(Usdt, 97), Usdt.abi);
