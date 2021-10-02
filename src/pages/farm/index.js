import React, { lazy } from 'react';
import { Box, useColorMode, useTheme } from '@chakra-ui/react';
import AlertNews from './AlertNews';
import Loadable from 'components/Loadable';
import Statistics from './Statistics';
import ListPool from './ListPool';
import ScrollButton from 'components/ScrollButton';
import FwarPool from 'contracts/FwarPool/FwarPools.json';
import FwarKeyContract from 'contracts/FwarKey/FWarKey.json';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import LPFBNBUSD from './pool/FBNB-Usdt';
import { useAllMyKey, useDailyRewards, useTitle, useTotalStakedAndPendingKey } from 'dapp/hook';

// fake data
const news = [
  { id: 1, content: 'new message 1' },
  { id: 2, content: 'new message 2' }
];
const listPool = [{ id: '0', address: LPFBNBUSD.address, abi: LPFBNBUSD.abi }];

const Farm = () => {
  useTitle('FWAR - FARM');

  const [newState, setNewSate] = React.useState([]);
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const { account } = useEthers();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // console.log(window.ethereum);
  // const FwarPoolNetWork = FwarPool.networks[97];
  // ----------------------------------------------------------------
  const fwarPool = new ethers.Contract(
    '0xea85f5A3123Fd1F067FA44c5D84DD8D9c06F3d48',
    FwarPool.abi,
    signer
  );
  const FWK = new ethers.Contract(
    FwarKeyContract.networks[97].address,
    FwarKeyContract.abi,
    signer
  );
  const [pendingKeyState, totalStake] = useTotalStakedAndPendingKey(fwarPool, listPool, 'lpSupply');
  const allMyKey = useAllMyKey(FWK);
  const dailyRewards = useDailyRewards(fwarPool);

  const handleCloseMessage = (id) => {
    const newList = newState.filter((i) => i.id !== id);
    setNewSate(newList);
  };
  const alerts = newState?.map((i) => (
    <AlertNews key={i.id} id={i.id} content={i.content} onClose={handleCloseMessage} />
  ));
  return (
    <Box>
      {alerts}

      {/* Statistics */}

      <Box
        bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
        marginBottom="2rem"
        borderRadius="md"
        boxShadow={theme.shadows.content}
      >
        <Statistics
          totalStake={totalStake}
          dailyRewards={dailyRewards}
          allMyKey={allMyKey}
          pendingKeyState={pendingKeyState}
        />
      </Box>
      <Box marginBottom="2rem">
        <ListPool account={account} FwarPool={fwarPool} signer={signer} listPool={listPool} />
      </Box>
    </Box>
  );
};
export default Farm;
