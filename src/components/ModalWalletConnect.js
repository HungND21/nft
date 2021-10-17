import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Link,
  Flex,
  useClipboard
} from '@chakra-ui/react';
import { ExternalLinkIcon, CopyIcon } from '@chakra-ui/icons';
import MetaMaskOnboarding from '@metamask/onboarding';

import { UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import React from 'react';
import { useSelector } from 'react-redux';
import { useEthers } from '@usedapp/core';
import { isMetaMaskInstalled } from 'dapp/metamask';

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    return error.message;
  }
}
const forwarderOrigin = 'http://localhost:3000';

function ModalWalletConnect({ onClose }) {
  const onboarding = React.useRef();

  // const { active, error, account, library, connector, activate, deactivate } = useWeb3React();
  const { isOpenModalWallet } = useSelector((state) => state.metamask);

  const { activateBrowserWallet, error, deactivate, account } = useEthers();
  const { hasCopied, onCopy } = useClipboard(account);
  function handleDeactivateAccount() {
    deactivate();
    // onClose();
  }
  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);
  React.useEffect(() => {
    if (isMetaMaskInstalled()) activateBrowserWallet();
  }, []);
  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then((newAccounts) => {
        console.log('newAccounts', newAccounts);
        activateBrowserWallet();
      });
    } else {
      // toast.error(getErrorMessage(error), { duration: 3000 });
      onboarding.current.startOnboarding();
    }
  };
  return (
    <>
      <Modal isOpen={isOpenModalWallet} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="26rem">
          <ModalHeader>{account ? `Connect To Wallet` : `Your Wallet Address`} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {account ? (
              <Stack direction="column" align="center" mb={4}>
                <Text fontSize="14px" mb={2}>
                  {account}
                </Text>
                <Flex alignContent="center" m={3}>
                  <Button
                    variant="link"
                    color="gray.400"
                    fontWeight="normal"
                    fontSize="sm"
                    _hover={{
                      textDecoration: 'none',
                      color: 'primary.base'
                    }}
                    onClick={onCopy}
                  >
                    <CopyIcon mr={1} />
                    {hasCopied ? 'Copied' : 'Copy Address'}
                  </Button>
                  <Link
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    href={`https://testnet.bscscan.com/address/${account}`}
                    isExternal
                    color="gray.400"
                    ml={6}
                    _hover={{
                      color: 'primary.base',
                      textDecoration: 'underline'
                    }}
                  >
                    <ExternalLinkIcon mr={1} />
                    View on Explorer
                  </Link>
                </Flex>
                <Button borderRadius="10rem" onClick={handleDeactivateAccount}>
                  Logout
                </Button>
              </Stack>
            ) : (
              <Box mb={4} borderRadius="4px">
                <Stack
                  direction="row"
                  align="center"
                  justify="start"
                  border="1px solid rgba(34,41,47,.125)"
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{
                    bg: '#f8f8f8'
                  }}
                  // onClick={connect}
                  onClick={onClick}
                >
                  <Image src="/assets/metamaskicon.svg" />
                  <Text>Metamask</Text>
                </Stack>
                <Stack
                  direction="row"
                  align="center"
                  justify="start"
                  border="1px solid rgba(34,41,47,.125)"
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{
                    bg: '#f8f8f8'
                  }}
                >
                  <Image src="/assets/binanceWallet.svg" />
                  <Text>Binance Chain Wallet</Text>
                </Stack>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalWalletConnect;
