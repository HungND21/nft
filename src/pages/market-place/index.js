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
  Button,
  GridItem
} from '@chakra-ui/react';
import { Container, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator';
import { ChevronRightIcon, SearchIcon, HamburgerIcon } from '@chakra-ui/icons';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import FwarCharJson from 'contracts/FwarChar/FWarChar.json';
import FwarMarketDelegateJson from 'contracts/FwarMarket/FwarMarketDelegate.json';

import Usdt from 'contracts/Usdt.json';
import { elementDropdown, rarityDropdown, cardTypeDropdown } from 'utils/dataFilter';
import Web3 from 'web3';
// import marketDelegate from 'utils/dataFilter';

// import Card from 'components/Card';
import DisplayOrderCards from './DisplayOrderCards';

import OrderApi from 'apis/OrderApi';
import TeamApi from 'apis/TeamApi';
import { useSelector } from 'react-redux';
import { useTitle } from 'dapp/hook';

import FilterComponent from 'components/FilterComponent';

function MarketPlace() {
  useTitle('FWAR - MARTKET PLACE');
  
  const [isApprove, setIsApprove] = React.useState(false);
  const [listOrder, setListOrder] = React.useState([]);
  const { account } = useEthers();
  const { user } = useSelector((state) => state.user);
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const [rarityState, setRarityState] = React.useState('');
  const [elementState, setElementState] = React.useState('');
  const [teamIdState, setTeamIdState] = React.useState('');
  const [typeCardState, setTypeCardState] = React.useState('');
  const [teamDropdown, setTeamDropdown] = React.useState([]);
  // paginate
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1, pageSize: 5 }
  });
  const [pagesQuantity, setPagesQuantity] = React.useState(1);


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
    // toast.success('cancel successfully!');
    // console.log(result);
  };

  const handleChangeRarity = (rarity) => {
    console.log('rarity', rarity);
    setRarityState(rarity);
    setCurrentPage(1);
  };
  const handleChangeElement = (element) => {
    console.log('element', element);
    setElementState(element);
    setCurrentPage(1);
  };
  const handleChangeTeamId = (teamId) => {
    console.log('teamId', teamId);
    setTeamIdState(teamId);
    setCurrentPage(1);
  };

  const handleChangeCardType = (typeCard) => {
    console.log('typeCard', typeCard);
    setTypeCardState(typeCard);
    setCurrentPage(1);
  };
  //Get Team Dropdown
  const getTeams = async () => {
    const { data: listTeams } = await TeamApi.getALl();
    const teams = listTeams.map((i) => ({ value: i.teamId, label: i.name }));
    // console.log('listTeams', listTeams);
    setTeamDropdown(teams);
  };
  const init = async () => {
    const allowance = await USDT.allowance(
      account,
      FwarMarketDelegateJson.networks[97].address // address FwarMarketDelegate
    );
    if (allowance > 0) setIsApprove(true);
    const { data: orders } = await OrderApi.getAll({
      currentPage,
      rarity: rarityState,
      element: elementState, 
      teamId: teamIdState, 
      typeCard: typeCardState
    });
    setListOrder(orders.docs);
    setPagesQuantity(orders.totalPages);
    console.log(orders.docs);
  };
  React.useEffect(() => {
    if (account) {
      init();
      getTeams();
      console.log('user',user);
    }
  }, [account, rarityState, elementState, teamIdState, typeCardState]);
  
  const baseStyles = {
    w: 7,
    fontSize: 'sm'
  };

  const activeStyles = {
    ...baseStyles,
    _hover: {
      bg: 'green.300'
    },
    bg: 'green.300'
  };
  return (
    <>
      {/* bread crumb */}
      {/* Sidebar */}
      <Box
        bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
        p={8}
        boxShadow="content"
        borderRadius={8}
        position="relative"
      >
        <Grid templateColumns="repeat(6, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 6, md: 5 }}>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
                <FilterComponent
                  placeholder="CardType"
                  handleChange={handleChangeCardType}
                  valueState={typeCardState}
                  optionDropdown={cardTypeDropdown}
                />
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
                <FilterComponent
                  placeholder="Rarity"
                  handleChange={handleChangeRarity}
                  valueState={rarityState}
                  optionDropdown={rarityDropdown}
                />
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
                <FilterComponent
                  placeholder="Element"
                  handleChange={handleChangeElement}
                  valueState={elementState}
                  optionDropdown={elementDropdown}
                />
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
                <FilterComponent
                  placeholder="Team"
                  handleChange={handleChangeTeamId}
                  valueState={teamIdState}
                  optionDropdown={teamDropdown}
                />
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Box>

      <Box display="flex" alignItems="start">
        <Box
          display={{
            base: 'none',
            lg: 'block'
          }}
        >
        </Box>
        <Box width="100%" marginLeft={6}>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            }}
            gap={6}
            mt={6}
          >
            {listOrder&&listOrder.length > 0 &&
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
                  <Stack direction="column" justify="space-between" h="100%">
                    <Grid
                      templateColumns=
                        {card.nfts.length !== 1 ? 'repeat(2, 1fr)':'repeat(1, 1fr)'}
                      templateRows = {card.nfts.length !== 1 ? 'repeat(2, 1fr)':'repeat(1, 1fr)'}
                    >
                      {card.nfts.map((item) => (
                        <Link to={`/market-place/detail/${item.nftId}`} key={item.nftId}>
                          <DisplayOrderCards 
                          info = {item}
                          text = {true}
                          isOne = {card.nfts.length === 1}
                          />
                        </Link>
                      ))}
                    </Grid>
                    <Box color="white" align="center" cursor="pointer">
                      <Grid gridTemplateColumns="repeat(2, 1fr)">
                        <Box bg="secondary.base" py={2} fontSize={13}>
                          {card.price} USDT
                        </Box>
                        <Box
                        bg="warning.base"
                        py={2}
                        fontSize={13}
                        onClick={() => {
                          isApprove
                            ? card.userId._id === user._id
                              ? handleUnList(FwarMarketDelegate, FwarChar.address, card.nfts.map((i)=> i.nftId))
                              : handleBuy(FwarMarketDelegate, card.orderId)
                            : handleApprove(USDT, FwarMarketDelegate.address);
                        }}
                      >
                        {isApprove ? (card.userId._id === user._id ? `unList` : `Buy`) : `Approve`}

                      </Box>
                      </Grid>
                    </Box>
                  </Stack>
                </Box>
              ))} 
          </Grid>
          <Box>
            <Paginator
              pagesQuantity={pagesQuantity > 0 && pagesQuantity}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              activeStyles={activeStyles}
              // normalStyles={normalStyles}
              outerLimit={3}
              innerLimit={3}
            >
              <Container align="center" justify="space-between" w="full" p={4}>
                <Previous>
                  Previous
                  {/* Or an icon from `react-icons` */}
                </Previous>
                <PageGroup isInline align="center" />
                <Next>
                  Next
                  {/* Or an icon from `react-icons` */}
                </Next>
              </Container>
            </Paginator>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default MarketPlace;
