import { Grid, useColorMode, useTheme } from '@chakra-ui/react';
import React from 'react';
import PoolContract from './pool';

function ListPool({ FwarPool, account, signer, listPool }) {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  return (
    <>
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
            signer={signer}
            FwarPool={FwarPool}
            pool={pool}
            fwarPoolAddress="0xea85f5A3123Fd1F067FA44c5D84DD8D9c06F3d48"
          />
        ))}
      </Grid>
    </>
  );
}

export default ListPool;
