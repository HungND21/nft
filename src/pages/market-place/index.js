import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Stack, useTheme, Grid, useColorMode, GridItem } from '@chakra-ui/react';
import { Container, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import FwarCharJson from 'contracts/FwarChar/FWarChar.json';
import FwarMarketDelegateJson from 'contracts/FwarMarket/FwarMarketDelegate.json';

import Usdt from 'contracts/Usdt.json';
import { elementDropdown, rarityDropdown, cardTypeDropdown, sortDropdown } from 'utils/dataFilter';
// import marketDelegate from 'utils/dataFilter';

// import Card from 'components/Card';
import DisplayOrderCards from './DisplayOrderCards';

import OrderApi from 'apis/OrderApi';
import TeamApi from 'apis/TeamApi';
import { useSelector } from 'react-redux';
import { useTitle } from 'dapp/hook';

import FilterComponent from 'components/FilterComponent';
import PaginatorCustom from 'components/PaginatorCustom';
import Loader from 'components/Loader';

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
  const [sortState, setSortState] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
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
    try {
      setIsLoading(true);
      const result = await USDT.approve(
        FwarMarketDelegate,
        ethers.BigNumber.from(1e6).pow(3).mul(1000000)
      );
      const tx = await result.wait();
      console.log('tx', tx);
      setIsLoading(false);
      toast.success('approve for all successfully!');
    } catch (error) {
      error.data ? toast.error(error.data.message) : toast.error(error.message);
      setIsLoading(false);
    }
  };
  const handleBuy = async (FwarMarketDelegate, orderId) => {
    console.log(orderId);

    try {
      setIsLoading(true);
      const result = await FwarMarketDelegate.buyOrder(orderId);
      console.log(result);
      const tx = await result.wait();
      console.log('tx', tx);
      toast.success('Buy successfully!');
      setIsLoading(false);
    } catch (error) {
      error.data ? toast.error(error.data.message) : toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleUnList = async (FwarMarketDelegate, FwarCharAddress, nftIds, tokenUsdt = '') => {
    try {
      setIsLoading(true);
      tokenUsdt = '0xB3C3575552F6e250E2Ee7EeB94BB9BD91E57e51E';
      console.log('nftIds', nftIds);
      const result = await FwarMarketDelegate.cancelOrder(FwarCharAddress, nftIds, tokenUsdt);
      const tx = await result.wait();
      console.log('tx', tx);
      toast.success('unlist successfully!');
      setIsLoading(false);
    } catch (error) {
      error.data ? toast.error(error.data.message) : toast.error(error.message);
      setIsLoading(false);
    }
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
  const handleChangeSort = (sort) => {
    console.log('sort', sort);
    setSortState(sort);
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
      typeCard: typeCardState,
      sort: sortState
    });
    setListOrder(orders.docs);
    setPagesQuantity(orders.totalPages);
    console.log(orders.docs);
  };
  React.useEffect(() => {
    if (account) {
      init();
      getTeams();
      console.log('user', user);
    }
  }, [account, rarityState, elementState, teamIdState, typeCardState, sortState]);

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
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 6, md: 5 }}>
            <Grid templateColumns="repeat(5, 1fr)" alignItems="center" gap={4}>
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
              <GridItem>
                <FilterComponent
                  placeholder="Sort"
                  handleChange={handleChangeSort}
                  valueState={sortState}
                  optionDropdown={sortDropdown}
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
        ></Box>
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
            {listOrder &&
              listOrder.length > 0 &&
              listOrder.map((card) => (
                <Box
                  key={card.orderId}
                  w="100%"
                  bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  borderRadius="6px"
                  overflow="hidden"
                  pos="relative"
                  _hover={{ boxShadow: '0 4px 25px 0 rgba(34,41,47,.25)' }}
                >
                  {isLoading && (
                    <Stack
                      direction="row"
                      justify="center"
                      align="center"
                      pos="absolute"
                      zIndex="docked"
                      bg="#f6f6f6"
                      opacity="0.85"
                      inset="0"
                    >
                      <Loader size="lg" />
                    </Stack>
                  )}
                  <Stack direction="column" justify="space-between" h="100%">
                    <Grid
                      templateColumns={card.nfts.length !== 1 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'}
                      templateRows={card.nfts.length !== 1 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'}
                    >
                      {card.nfts.map((item) => (
                        <Link to={`/market-place/detail/${item.nftId}`} key={item.nftId}>
                          <DisplayOrderCards
                            info={item}
                            text={true}
                            isOne={card.nfts.length === 1}
                          />
                        </Link>
                      ))}
                    </Grid>
                    <Box color="white" align="center">
                      <Grid gridTemplateColumns="repeat(2, 1fr)">
                        <Box bg="secondary.base" py={2} fontSize={13}>
                          {card.price} USDT
                        </Box>
                        <Box
                          bg={theme.colors.primary.base}
                          py={2}
                          _hover={{
                            background: theme.colors.light,
                            color: theme.colors.primary.base,
                            border: '1px',
                            borderColor: theme.colors.primary.base
                          }}
                          cursor="pointer"
                          fontSize={13}
                          fontWeight="bold"
                          onClick={() => {
                            if (isApprove) {
                              card.userId === user._id
                                ? handleUnList(
                                    FwarMarketDelegate,
                                    FwarChar.address,
                                    card.nfts.map((i) => i.nftId)
                                  )
                                : handleBuy(FwarMarketDelegate, card.orderId);
                            } else {
                              handleApprove(USDT, FwarMarketDelegate.address);
                            }
                          }}
                        >
                          {isApprove ? (card.userId === user._id ? `unList` : `Buy`) : `Approve`}
                        </Box>
                      </Grid>
                    </Box>
                  </Stack>
                </Box>
              ))}
          </Grid>
          <Box mt={5}>
            <PaginatorCustom
              pagesQuantity={pagesQuantity > 0 && pagesQuantity}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default MarketPlace;
