import { InjectedConnector } from '@web3-react/injected-connector';
export const POLLING_INTERVAL = 12000;

export const injected = new InjectedConnector({
  chainIds: [1, 3, 4, 5, 42, 97]
});
