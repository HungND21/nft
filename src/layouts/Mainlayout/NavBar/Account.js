import { Box } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { openModalWalletConnect } from 'store/metamaskSlice';

export function Account() {
  const { account } = useEthers();

  const dispatch = useDispatch();

  return (
    <>
      <Box
        bg="primary.base"
        px={4}
        py={1.5}
        borderRadius="10rem"
        color="white.base"
        fontWeight="medium"
        cursor="pointer"
        _hover={{ boxShadow: '0 8px 25px -8px #FEBE43;' }}
        transition="color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,background 0s,border 0s"
        onClick={() => dispatch(openModalWalletConnect())}
      >
        {account === null
          ? '-'
          : account
          ? `${account.slice(0, 6)}...${account.slice(account.length - 4, account.length)}`
          : 'Connect To Wallet'}
      </Box>
    </>
  );
}
