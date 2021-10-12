import React from 'react';
import { HamburgerIcon, MoonIcon } from '@chakra-ui/icons';

import {
  IconButton,
  Box,
  useColorMode,
  useTheme,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Image
} from '@chakra-ui/react';
import Select from 'react-select';
import FilterComponent from 'components/FilterComponent';

import { useDispatch } from 'react-redux';
import { openDrawer } from 'store/customizationSlice';
import { regionDropdown } from './regionDropdown';
import MetaMaskOnboarding from '@metamask/onboarding';

import { FiSettings } from 'react-icons/fi';
import { Account } from './Account';

function NavBar() {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const handleOpenDrawer = () => {
    dispatch(openDrawer());
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const { ethereum } = window;
  // if (ethereum) {
  //   // ethereum.request({ method: 'eth_requestAccounts' });
  // } else {
  //   // const onboarding = new MetaMaskOnboarding({ forwarderOrigin: 'http://localhost:3000' });
  //   // onboarding.startOnboardizng();
  // }
  return (
    <>
      <Box
        as="nav"
        bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
        pos="fixed"
        top="0"
        right="0"
        w={{
          base: 'calc(100% - 56px)',
          xl: 'calc(100% - 56px - 260px)'
        }}
        m="1.3rem 28px 0"
        borderRadius="md"
        zIndex="100"
        boxShadow={theme.shadows.content}
      >
        <Stack direction="row" align="center" justify="space-between" p="0.8rem 1rem">
          <Stack direction="row" align="center">
            <IconButton
              variant="ghost"
              color={colorMode === 'dark' ? 'white.base' : 'primary.dark'}
              aria-label="color mode"
              onClick={handleOpenDrawer}
              icon={<HamburgerIcon />}
              display={{
                base: 'block',
                xl: 'none'
              }}
            />
            {/* <Text>English</Text> */}
            {/* <IconButton
              variant="ghost"
              color={colorMode === 'dark' ? 'white.base' : 'primary.base'}
              aria-label="color mode"
              onClick={toggleColorMode}
              icon={<MoonIcon />}
            /> */}
          </Stack>
          <Stack direction="row" align="center">
            <Account />

            <Menu isLazy>
              <MenuButton>
                <Stack direction="row" align="center" justify="center">
                  <Box fontSize="small">
                    <Text fontWeight="semibold">Hieu</Text>
                    <Text>VietNam</Text>
                  </Box>
                  <Avatar w={10} h={10} src="https://zoogame.app/country/17.png" />
                </Stack>
              </MenuButton>
              <MenuList w="20px">
                {/* MenuItems are not rendered unless Menu is open */}
                <MenuItem icon={<FiSettings />} onClick={onOpen}>
                  Settings
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Stack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction="row" align="center">
              <Image src="https://zoogame.app/country/17.png" h="50px" />
              <Box w="100%">
                <FilterComponent placeholder="Select Region" optionDropdown={regionDropdown} />
                {/* <Text>You can choose your region now</Text> */}
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              w="100%"
              bg={colorMode === 'dark' ? theme.colors.dark.light : '#FEBE43'}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NavBar;
