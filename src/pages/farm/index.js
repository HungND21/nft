import { Box, Grid, useColorMode, useTheme } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import ScaleFadeCustom from 'components/ScaleFadeCustom';
import FwarKeyContract from 'contracts/FwarKey/FWarKey.json';
import FwarPool from 'contracts/FwarPool/FwarPools.json';
import { getEthersContract, networkChainId } from 'dapp/getEthersContract';
import { useAllMyKey, useDailyRewards, useTitle, useTotalStakedAndPendingKey } from 'dapp/hook';
import React from 'react';
import AlertNews from './AlertNews';
import PoolContract from './pool';
import LPFBNBUSD from './pool/FBNB-Usdt';
import Statistics from './Statistics';

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

  const fwarPool = getEthersContract('0xea85f5A3123Fd1F067FA44c5D84DD8D9c06F3d48', FwarPool.abi);
  const FWK = getEthersContract(networkChainId(FwarKeyContract, 97), FwarKeyContract.abi);
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
    <>
      <ScaleFadeCustom>
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
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            }}
            gap={6}
          >
            {listPool?.map((pool) => (
              <PoolContract
                key={pool.id}
                theme={theme}
                colorMode={colorMode}
                account={account}
                // signer={signer}
                FwarPool={fwarPool}
                pool={pool}
                fwarPoolAddress="0xea85f5A3123Fd1F067FA44c5D84DD8D9c06F3d48"
              />
            ))}
          </Grid>
        </Box>
      </ScaleFadeCustom>
    </>
  );
};
export default Farm;
