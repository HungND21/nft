import React from 'react';
import {
  Box,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  useTheme,
  Input,
  Grid,
  Icon,
  useColorMode,
  Image,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody
} from '@chakra-ui/react';
import { ChevronRightIcon, SearchIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

function MarketPlace() {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const arr = new Array(12).fill(1);

  return (
    <>
      {/* bread crumb */}
      <Stack direction="row" align="center" mb="21px">
        <Text as="h2" fontWeight="medium" fontSize={21} lineHeight="shorter" pr={2}>
          My ZOO Balance 0
        </Text>
      </Stack>
      {/* Sidebar */}
      <Box width="100%">
        {/* Card */}
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          }}
          gap={6}
          mt={6}
        >
          {arr.map((item, index) => (
            <Box
              key={index}
              w="100%"
              bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
              boxShadow="content"
              borderRadius="6px"
              overflow="hidden"
              cursor="pointer"
              _hover={{ boxShadow: '0 4px 25px 0 rgba(34,41,47,.25)' }}
            >
              <Box position="relative">
                <Image src="https://zoogame.app/nfts/bg/1/border.png" width="100%" />
                <Image
                  src="https://zoogame.app/nfts/bg/2/bg.png"
                  width="100%"
                  position="absolute"
                  top="0"
                />
                <Image
                  src="https://zoogame.app/nfts/normal/9.png"
                  position="absolute"
                  width="100%"
                  top="12%"
                  left="5%"
                />
                <Box
                  bgImage="https://zoogame.app/nfts/name.png"
                  bgRepeat="no-repeat"
                  bgSize="100% 100%"
                  position="absolute"
                  width="80%"
                  bottom="18%"
                  left="10%"
                  p="7%"
                  color="white"
                  align="center"
                >
                  <Text>60 Zu</Text>
                </Box>
              </Box>

              <Box color="white" align="center" cursor="pointer">
                <Box bg="warning.base" py={2} fontSize={13}>
                  Approve
                </Box>
              </Box>
            </Box>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default MarketPlace;
