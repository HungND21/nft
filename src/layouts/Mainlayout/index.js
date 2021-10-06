import React from 'react';
import { Box, useColorMode, useColorModeValue, useTheme } from '@chakra-ui/react';
import ModalWalletConnect from 'components/ModalWalletConnect';
import ScrollButton from 'components/ScrollButton';
import { Toaster } from 'react-hot-toast';

import { useEthers, useEtherBalance, useTransactions } from '@usedapp/core';

// import Loadable from 'components/Loadable';
// const DrawerMain = Loadable(lazy(() => import('./Drawer')));
// const NavBar = Loadable(lazy(() => import('./NavBar')));
import { useDispatch, useSelector } from 'react-redux';
import { closeModalWalletConnect, existMetamask } from 'store/metamaskSlice';
import DrawerMain from './Drawer';
import NavBar from './NavBar';
import { ethers } from 'ethers';

import { setItem, getItem, clearItem } from 'utils/LocalStorage';
import UserApi from 'apis/UserApi';
import toast from 'react-hot-toast';
import { existUser } from 'store/userSlice';

export default function MainLayout({ children }) {
  const dispatch = useDispatch();

  const { user, isLogin } = useSelector((state) => state.user);
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const { activateBrowserWallet, account } = useEthers();

  const bg = useColorModeValue('white', theme.colors.dark.light);
  const color = useColorModeValue('#6e6b7b', 'white');
  // const userState = useSelector((state) => state.user);
  // console.log('userState layout ', userState);

  //
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const handleAuthenticate = async ({ address, signature }) => {
    try {
      return await UserApi.login({
        address,
        signature
      });
    } catch (error) {
      return;
    }
  };
  const handleSignMessage = async (address) => {
    try {
      const signature = await signer.signMessage('Login');
      return { address, signature };
    } catch (err) {
      throw new Error('You need to sign the message to be able to log in.');
    }
  };
  const handleSignup = async (address) => await UserApi.signup(address);
  React.useEffect(() => {
    activateBrowserWallet();
    const init = async () => {
      try {
        const accessToken = getItem('accessToken');
        if (account) {
          if (!accessToken) {
            const { data } = await UserApi.find(account);
            // console.log(data);
            if (!data) await handleSignup(account);
            const { address, signature } = await handleSignMessage(account);
            const {
              data: { accessToken }
            } = await handleAuthenticate({ address, signature });
            setItem('accessToken', accessToken);
          } else {
            toast.success('login success');

            // console.log('login');
            // const newUser = await UserApi.signup(account)
          }
        }
      } catch (error) {
        toast.error(error);
      }
    };
    // init();
    if (account) {
      const getUser = async () => {
        const user = await dispatch(existUser(account));
      };
      getUser();
    }
    return () => {};
  }, [account]);

  const closeModalWallet = () => {
    dispatch(closeModalWalletConnect());
  };
  return (
    <React.Fragment>
      <Box bg="#f8f8f8" color={color} h="calc(100vh)">
        <Box
          w="16.25rem"
          // h="100%"
          bg={bg}
          boxShadow="drawer"
          display={{
            base: 'none',
            xl: 'block'
          }}
          position="fixed"
          zIndex="10"
          h="100%"
        >
          <DrawerMain />
        </Box>

        {/* Nav bar */}
        <NavBar />

        {/* Content */}
        <Box
          position="relative"
          bg={colorMode === 'dark' ? theme.colors.dark.base : 'light'}
          w={{
            base: 'full',
            xl: 'calc(100% - 260px)'
          }}
          h="100%"
          ml={{
            base: '0px',
            xl: '260px'
          }}
          p="7rem 28px 0"
          // overflowY="scroll"
        >
          <Box
            position="fixed"
            w="100%"
            pt="2.2rem"
            left="0"
            top="0"
            bgGradient={
              colorMode === 'dark'
                ? 'linear-gradient(180deg,rgba(22,29,49,.9) 44%,rgba(22,29,49,.43) 73%,rgba(22,29,49,0))'
                : 'linear-gradient(180deg,hsla(0,0%,97.3%,.95) 44%,hsla(0,0%,97.3%,.46) 73%,hsla(0,0%,100%,0))'
            }
            zIndex="8"
          />
          {children}
          <ModalWalletConnect onClose={closeModalWallet} />

          <ScrollButton />
        </Box>
      </Box>
      <Box zIndex="toast">
        <Toaster />
      </Box>
    </React.Fragment>
  );
}
