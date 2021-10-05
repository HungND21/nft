import React from 'react';
import { Link } from 'react-router-dom';
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
  DrawerBody,
  Button
} from '@chakra-ui/react';
import { ChevronRightIcon, SearchIcon, HamburgerIcon } from '@chakra-ui/icons';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import FwarCharJson from 'contracts/FwarChar/FWarChar.json';
import FwarMarketDelegateJson from 'contracts/FwarMarket/FwarMarketDelegate.json';

import Usdt from 'contracts/Usdt.json';
import Web3 from 'web3';
// import marketDelegate from 'utils/dataFilter';

import Sidebar from './Sidebar';
import DisplayOrderCards from './DisplayOrderCards';
import OrderApi from 'apis/OrderApi';
import { useSelector } from 'react-redux';
import { useTitle } from 'dapp/hook';

function MarketPlace() {
  useTitle('FWAR - MARTKET PLACE');

  const [isApprove, setIsApprove] = React.useState(false);
  const [listOrder, setListOrder] = React.useState([]);
  const { account } = useEthers();
  const { user } = useSelector((state) => state.user);

    //
    const [rarityState, setRarityState] = React.useState('');
    const [elementState, setElementState] = React.useState('');
    const [teamIdState, setTeamIdState] = React.useState('');
    const [levelState, setLevelState] = React.useState('');
    const [typeCardState, setTypeCardState] = React.useState('');
    //

  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const FwarChar = new ethers.Contract(FwarCharJson.networks[97].address, FwarCharJson.abi, signer);
  const FwarMarketDelegate = new ethers.Contract(
    FwarMarketDelegateJson.networks[97].address,
    FwarMarketDelegateJson.abi,
    signer
  );
  const USDT = new ethers.Contract(Usdt.networks[97].address, Usdt.abi, signer);

  const handleApprove = async (USDT, FwarMarketDelegate) => {
    const result = await USDT.approve(
      FwarMarketDelegate,
      ethers.BigNumber.from(1e6).pow(3).mul(1000000)
    );
    console.log(result);
    toast.success('approve for all successfully!');
  };
  const handleBuy = async (FwarMarketDelegate, index) => {
    console.log(index);
    // const getOrderId = await marketDelegate.getOrderId(FwarMarketDelegate);
    // console.log(getOrderId[index]);
    // const result = await FwarMarketDelegate.buyOrder(getOrderId[index]['orderId']);
    // console.log(result);
  };

  const handleUnList = async (FwarMarketDelegate, FwarCharAddress, nftIds, tokenUsdt = '') => {
    tokenUsdt = '0xB3C3575552F6e250E2Ee7EeB94BB9BD91E57e51E';
    console.log(nftIds);
    const result = await FwarMarketDelegate.cancelOrder(FwarCharAddress, nftIds, tokenUsdt);
    toast.success('cancel successfully!');
    console.log(result);
  };

  const handleChangeRarity = (rarity) => {
    console.log('rarity', rarity);
    setRarityState(rarity);
  };
  const handleChangeTeam = (selectedteam) => {
    console.log('team', selectedteam);
    setTeamIdState(selectedteam);
  };

    
  const init = async () => {
    const allowance = await USDT.allowance(
      account,
      FwarMarketDelegateJson.networks[97].address // address FwarMarketDelegate
    );
    if (allowance > 0) setIsApprove(true);
  };

  const getOrderList = async() => {
    const { data: orders } = await OrderApi.getAll(
      {
        rarity: rarityState, 
        element: elementState, 
        teamId: teamIdState, 
        level: levelState, 
        typeCard: typeCardState
      }
    );
    console.log('orders', orders.docs);
    setListOrder(orders.docs);
  };
  React.useEffect(() => {
    // init();
    getOrderList();
    if (account) {
      init();
    }
  }, [account, rarityState, teamIdState]);
  return (
    <>
      {/* bread crumb */}
      <Stack direction="row" align="center" mb="21px">
        <Text
          as="h2"
          fontWeight="medium"
          fontSize={25}
          lineHeight="shorter"
          pr={2}
          borderRight="1px solid #d6dce1"
        >
          Market
        </Text>
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <Link to="/farm">
              <Text color={theme.colors.primary.base}>Home</Text>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link to="/market-place">
              <Text color={theme.colors.primary.base}>Market</Text>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">NFTs</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Stack>
      {/* Sidebar */}
      <Box display="flex" alignItems="start">
        <Box
          display={{
            base: 'none',
            lg: 'block'
          }}
        >
          <Sidebar 
            handleChangeRarity={handleChangeRarity} 
            valueState ={rarityState} 
            handleChangeTeam={handleChangeTeam} 
            valueTeam={teamIdState} 
          />
        </Box>
        <Box width="100%" marginLeft={6}>
          <Stack direction="row" justify="space-between">
            <Stack direction="row" align="center">
              <IconButton
                variant="ghost"
                color={colorMode === 'dark' ? 'white.base' : 'primary.dark'}
                aria-label="color mode"
                onClick={onOpen}
                icon={<HamburgerIcon />}
                display={{
                  base: 'block',
                  lg: 'none'
                }}
              />
              <Box>{listOrder && listOrder.length} results</Box>
            </Stack>
            <Box></Box>
          </Stack>
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>
                <Sidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          {/* Card */}
          {/* <Box
            display="flex"
            justify="space-between"
            alignItems="center"
            mt={3}
            px={4}
            py={2}
            bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
            borderRadius="6px"
            boxShadow="content"
          >
            <Input variant="unstyled" placeholder="Search by card's name" />
            <Icon as={SearchIcon}></Icon>
          </Box> */}
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            }}
            gap={6}
            mt={6}
          >
            {listOrder&&listOrder.length &&
              listOrder.map((card) => (
                <Box
                  key={card.orderId}
                  w="100%"
                  bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  borderRadius="6px"
                  overflow="hidden"
                  cursor="pointer"
                  _hover={{ boxShadow: '0 4px 25px 0 rgba(34,41,47,.25)' }}
                >
                  {card.nfts.length !==1 ?
                  <Grid  templateColumns="repeat(2 , 1fr)" templateRows="repeat(2, 1fr)" gap={4}>
                  {card.nfts.map((c) => (
                    <Link to={`/market-place/detail/${c.nftId}`} key={c.nftId}>
                      <DisplayOrderCards info={c} text={true} />
                    </Link>
                  ))}
                   </Grid> : 
                   <Grid  templateColumns="repeat(1 , 1fr)" templateRows="repeat(1, 1fr)" gap={4}>
                   {card.nfts.map((c) => (
                     <Link to={`/market-place/detail/${c.nftId}`} key={c.nftId}>
                       <DisplayOrderCards info={c} text={true} isOne = {true} />
                     </Link>
                   ))}
                    </Grid>
                  }
                  <Stack direction="column" justify="space-between" h="100%">
                    {/*  */}
                    <Box color="white" align="center" cursor="pointer">
                      <Box bg="secondary.base" py={2} fontSize={13}>
                        {card.price} USDT
                      </Box>
                      <Box
                        bg="warning.base"
                        py={2}
                        fontSize={13}
                        onClick={() => {
                          isApprove
                            ? card.userId === user._id
                              ? handleUnList(FwarMarketDelegate, FwarChar.address, card.nftIds)
                              : handleBuy(FwarMarketDelegate, card.orderId)
                            : handleApprove(USDT, FwarMarketDelegate.address);
                        }}
                      >
                        {isApprove ? (card.userId === user._id ? `unList` : `Buy`) : `Approve`}
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default MarketPlace;
