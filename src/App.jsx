import * as React from 'react';
import './App.css';
// web3
// import Web3 from 'web3';
import { Web3ReactProvider, Web3Provider } from '@web3-react/core';
import { DAppProvider } from '@usedapp/core';
// chakra

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import NavigationScroll from './layouts/NavigationScroll';
import Routes from './routes';
import Loader from 'components/Loader';
import { ethers } from 'ethers';
import Web3 from 'web3';

const config = {
  readOnlyChainId: 97,
  // readOnlyUrls: {
  //   97: 'https://data-seed-prebsc-1-s1.binance.org:8545'
  // },
  multicallAddresses: {
    97: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C'
  },
  supportedChains: [97]
};
function App() {
  return (
    <React.Suspense fallback={<Loader />}>
      {/* <Web3ReactProvider getLibrary={getLibrary}> */}
      <DAppProvider config={config}>
        <ChakraProvider theme={theme}>
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        </ChakraProvider>
      </DAppProvider>
      {/* </Web3ReactProvider> */}
    </React.Suspense>
  );
}
export default App;
