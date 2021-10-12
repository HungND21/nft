import { ethers } from 'ethers';

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
