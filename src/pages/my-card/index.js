import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useTheme
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
// api
import CharacterApi from 'apis/CharacterApi';
import TeamApi from 'apis/TeamApi';
import { usePaginator } from 'chakra-paginator';
// import Card from 'components/Card';
import DisplayOpenedCards from 'components/DisplayCard';
import FilterComponent from 'components/FilterComponent';
import Loader from 'components/Loader';
import PaginatorCustom from 'components/PaginatorCustom';
import ScaleFadeCustom from 'components/ScaleFadeCustom';
import FwarMarketDelegateJson from 'contracts/FwarMarket/FwarMarketDelegate.json';
import UsdtJson from 'contracts/Usdt.json';
import { useTitle } from 'dapp/hook';
import { ethers } from 'ethers';
import React from 'react';
import toast from 'react-hot-toast';
import { CgShoppingCart } from 'react-icons/cg';
import { FaRegCheckCircle } from 'react-icons/fa';
import { MdAddShoppingCart, MdInfoOutline, MdRemoveShoppingCart } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  cardTypeDropdown,
  elementDropdown,
  rarityDropdown,
  ListedOrNotDropdown
} from 'utils/dataFilter';
import { getItem } from 'utils/LocalStorage';
// import { getEthersContract, networkChainId } from 'dapp/getEthersContract';
import { isMetaMaskInstalled } from 'dapp/metamask';
import { openModalWalletConnect } from 'store/metamaskSlice';
import { FwarChar, FwarCharDelegate, FwarMarketDelegate } from 'dapp/getEthersContract';

function Card() {
  useTitle('FWAR - MY CARDS');

  const Theme = useTheme();
  const { colorMode } = useColorMode();
  const { account } = useEthers();
  // redux
  const { user } = useSelector((state) => state.user);
  // paginate
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1 }
  });
  //
  const [rarityState, setRarityState] = React.useState('');
  const [elementState, setElementState] = React.useState('');
  const [teamIdState, setTeamIdState] = React.useState('');
  const [typeCardState, setTypeCardState] = React.useState('');
  const [isListedState, setIsListedState] = React.useState('');

  //

  const [teamDropdown, setTeamDropdown] = React.useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isApprove, setIsApprove] = React.useState(false);

  const [listCardState, setListCardState] = React.useState([]); // list card
  const [listCardStorage, setListCardStorage] = React.useState([]); // card
  const [isLoading, setIsLoading] = React.useState(false);

  const [pagesQuantity, setPagesQuantity] = React.useState(1);

  const handleSell = (card) => {
    const listCartLocalStorage = localStorage.getItem('cardItem');
    let listCartArray = [];
    if (!listCartLocalStorage) {
      listCartArray.push(card);
      localStorage.setItem('cardItem', JSON.stringify(listCartArray));
      setListCardStorage(listCartArray);
      toast.success('add to card');
    } else {
      const listCartParse = JSON.parse(listCartLocalStorage);
      listCartArray = listCartParse;
      if (listCartParse.length > 3) {
        toast.error('card max 4');
      } else {
        const cartExist = listCartParse.find((i) => i.nftId === card.nftId);
        if (cartExist) {
          toast.error('card exist');
        } else {
          listCartArray.push(card);
          localStorage.setItem('cardItem', JSON.stringify(listCartArray));
          toast.success('add to card');
          setListCardStorage(listCartArray);
        }
      }
    }
  };

  const handleRemoveSell = (card) => {
    const listCardFilter = listCardStorage.filter((i) => i.nftId !== card.nftId);
    localStorage.setItem('cardItem', JSON.stringify(listCardFilter));
    setListCardStorage(listCardFilter);
    toast.success('remove card');
  };
  const handleOnchangePrice = (e, card) => {
    const currentCard = listCardStorage.map((i) => {
      if (i.nftId === card.nftId) {
        return { ...i, price: e.target.value };
      }
      return i;
    });
    setListCardStorage(currentCard);
    localStorage.setItem('cardItem', JSON.stringify(currentCard));
  };

  const handleCreateOrder = async () => {
    const notInputPrice = listCardStorage.every((i) => i.price && i.price > 0);
    if (notInputPrice) {
      try {
        setIsLoading(true);
        onClose();
        const expiration = 2 * 24 * 60 * 60;
        const totalPriceOrder = listCardStorage.reduce((acc, cur) => +acc + +cur.price, 0);
        const listCardOrderId = listCardStorage.map((i) => i.nftId);
        const result = await FwarMarketDelegate.createOrder(
          FwarChar.address,
          listCardOrderId,
          UsdtJson.networks[97].address, // usdtAddress
          ethers.BigNumber.from(1e9).pow(2).mul(totalPriceOrder),
          expiration
        );
        const tx = await result.wait();
        console.log('tx', tx);
        getMyCard(rarityState, elementState, teamIdState, typeCardState, isListedState);

        toast.success('create order Success');
        localStorage.removeItem('cardItem');
        setListCardStorage([]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  };
  // handleApprove(FwarChar, account, FwarMarketDelegateJson.networks[97].address);
  const handleApprove = async (FwarChar, owner, operator) => {
    if (account) {
      try {
        setIsLoading(true);
        const isApproveForAll = await FwarChar.isApprovedForAll(owner, operator);
        // ethers.BigNumber.from(1e6).pow(3).mul(1000000)

        if (!isApproveForAll) {
          const result = await FwarChar.setApprovalForAll(operator, true);
          await result.wait();
          setIsLoading(false);
          approveInit();
        }
      } catch (error) {
        error.data ? toast.error(error.data.message) : toast.error(error.message);
        setIsLoading(false);
      }
    }
  };

  const approveInit = async () => {
    const isApproveForAll = await FwarChar.isApprovedForAll(
      account,
      FwarMarketDelegateJson.networks[97].address
    );
    if (isApproveForAll) setIsApprove(true);
  };
  const getMyCard = async (
    rarityState,
    elementState,
    teamIdState,
    typeCardState,
    isListedState
  ) => {
    if (user) {
      const { data: listCard } = await CharacterApi.getMyList({
        userId: user._id,
        page: currentPage,
        rarity: rarityState ? rarityState.value : '',
        element: elementState ? elementState.value : '',
        teamId: teamIdState ? teamIdState._id : '',
        typeCard: typeCardState ? typeCardState.value : '',
        isListed: isListedState ? isListedState.value : ''
      });
      setListCardState(listCard.docs);
      console.log('listCard', listCard.docs);
      setPagesQuantity(listCard.totalPages);
    }
  };

  //Get Team Dropdown
  const getTeams = async () => {
    const { data: listTeams } = await TeamApi.getALl();
    const teams = listTeams.map((i) => ({ value: i.teamId, _id: i._id, label: i.name }));
    // console.log('listTeams', listTeams);
    setTeamDropdown(teams);
  };

  const handleChangeRarity = (rarity) => {
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
  const handleChangeIsListed = (isListed) => {
    console.log('isListed', isListed);
    setIsListedState(isListed);
    setCurrentPage(1);
  };
  React.useEffect(() => {
    const listCartParse = getItem('cardItem');
    console.log('current ', currentPage);
    if (listCartParse) {
      if (listCartParse.length) {
        setListCardStorage(listCartParse);
      }
    }
    if (account) {
      approveInit();
      getMyCard(rarityState, elementState, teamIdState, typeCardState, isListedState);
      getTeams();
      return () => {
        setListCardStorage();
        setIsApprove();
      };
    }
  }, [
    account,
    currentPage,
    user,
    rarityState,
    elementState,
    teamIdState,
    typeCardState,
    isListedState
  ]);
  let history = useHistory();
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
  const normalStyles = {
    ...baseStyles,
    _hover: {
      bg: 'green.300'
    },
    bg: 'blue.300'
  };

  return (
    <>
      <ScaleFadeCustom>
        <Box
          bg={colorMode === 'dark' ? Theme.colors.dark.light : 'white'}
          p={8}
          boxShadow="content"
          borderRadius={8}
          position="relative"
        >
          <Grid templateColumns="repeat(6, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 6, md: 5 }}>
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(5, 1fr)'
                }}
                gap={4}
              >
                <GridItem>
                  <FilterComponent
                    placeholder="CardType"
                    handleChange={handleChangeCardType}
                    valueState={typeCardState}
                    optionDropdown={cardTypeDropdown}
                  />
                </GridItem>
                <GridItem>
                  <FilterComponent
                    placeholder="Rarity"
                    handleChange={handleChangeRarity}
                    valueState={rarityState}
                    optionDropdown={rarityDropdown}
                  />
                </GridItem>
                <GridItem>
                  <FilterComponent
                    placeholder="Element"
                    handleChange={handleChangeElement}
                    valueState={elementState}
                    optionDropdown={elementDropdown}
                  />
                </GridItem>
                <GridItem>
                  <FilterComponent
                    placeholder="Team"
                    handleChange={handleChangeTeamId}
                    valueState={teamIdState}
                    optionDropdown={teamDropdown}
                  />
                </GridItem>
                <GridItem>
                  <FilterComponent
                    placeholder="Listed"
                    handleChange={handleChangeIsListed}
                    valueState={isListedState}
                    optionDropdown={ListedOrNotDropdown}
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={{ base: 6, md: 1 }}>
              <Box position="relative" align="right" cursor="pointer">
                <Icon as={CgShoppingCart} w={8} h={8} onClick={onOpen} />
                <Text position="absolute" top="-10px" right="0" color="red">
                  {listCardStorage ? listCardStorage.length : 0}
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Box>
        <Box>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(5, 1fr)'
            }}
            gap={6}
            mt={6}
          >
            {listCardState &&
              listCardState.length > 0 &&
              listCardState.map((card, index) => (
                <Box
                  key={card.nftId}
                  w="100%"
                  bg={colorMode === 'dark' ? Theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  borderRadius="6px"
                  overflow="hidden"
                  cursor="pointer"
                  role="group"
                  _hover={{ boxShadow: '0 4px 25px 0 rgba(34,41,47,.25)' }}
                  position="relative"
                >
                  <DisplayOpenedCards info={card} text={true} />
                  <Stack
                    direction="column"
                    justify="center"
                    alignItems="center"
                    bg={colorMode === 'dark' ? 'rgba(23, 37, 73, 0.7)' : 'rgba(242, 242, 242, 0.7)'}
                    w="100%"
                    h="100%"
                    position="absolute"
                    top="0"
                    left="0"
                    visibility="hidden"
                    _groupHover={{ visibility: 'visible' }}
                  >
                    <Button
                      _hover={
                        colorMode === 'dark'
                          ? {
                              bg: Theme.colors.dark.light,
                              color: Theme.colors.primary.base,
                              border: '2px'
                            }
                          : {
                              bg: Theme.colors.white.base,
                              color: Theme.colors.primary.base,
                              border: '2px'
                            }
                      }
                      backgroundColor={Theme.colors.primary.base}
                      onClick={() => {
                        let path = `./market-place/detail/${card.nftId}`;

                        history.push(path);
                      }}
                      w="80%"
                      gap={2}
                    >
                      <MdInfoOutline />
                      Detail
                    </Button>
                    {isApprove ? (
                      card.isListed ? (
                        <Text color="orange" fontSize="3xl" fontWeight="bold">
                          Listed
                        </Text>
                      ) : listCardStorage &&
                        listCardStorage.length &&
                        listCardStorage.find((i) => i.nftId === card.nftId) ? (
                        <Button
                          _hover={
                            colorMode === 'dark'
                              ? {
                                  bg: Theme.colors.dark.light,
                                  color: Theme.colors.removeSell.base,
                                  border: '2px'
                                }
                              : {
                                  bg: Theme.colors.white.base,
                                  color: Theme.colors.removeSell.base,
                                  border: '2px'
                                }
                          }
                          backgroundColor={Theme.colors.removeSell.base}
                          onClick={() => handleRemoveSell(card)}
                          w="80%"
                        >
                          <MdRemoveShoppingCart />
                          Remove
                        </Button>
                      ) : (
                        <Button
                          _hover={
                            colorMode === 'dark'
                              ? {
                                  bg: Theme.colors.dark.light,
                                  color: Theme.colors.red.sell,
                                  border: '2px'
                                }
                              : {
                                  bg: Theme.colors.white.base,
                                  color: Theme.colors.red.sell,
                                  border: '2px'
                                }
                          }
                          backgroundColor={Theme.colors.red.sell}
                          w="80%"
                          onClick={() => handleSell({ ...card, price: '' })}
                        >
                          <MdAddShoppingCart />
                          Sell
                        </Button>
                      )
                    ) : (
                      // ------- isApprove = false
                      <Button
                        _hover={
                          colorMode === 'dark'
                            ? {
                                bg: Theme.colors.dark.light,
                                color: Theme.colors.approve.base,
                                border: '2px'
                              }
                            : {
                                bg: Theme.colors.white.base,
                                color: Theme.colors.approve.base,
                                border: '2px'
                              }
                        }
                        backgroundColor={Theme.colors.approve.base}
                        w="80%"
                        onClick={() =>
                          handleApprove(
                            FwarChar,
                            account,
                            FwarMarketDelegateJson.networks[97].address
                          )
                        }
                      >
                        <FaRegCheckCircle />
                        Approve
                      </Button>
                    )}
                  </Stack>
                </Box>
              ))}
          </Grid>
        </Box>
        <Box my={5}>
          <PaginatorCustom
            pagesQuantity={pagesQuantity > 0 && pagesQuantity}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </Box>
        {/* loading*/}
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
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent w="1000px">
            <ModalHeader>Package for sale</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid
                templateColumns={{
                  base: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(4, 1fr)'
                }}
                gap={4}
                mt={4}
              >
                {listCardStorage &&
                  listCardStorage.length > 0 &&
                  listCardStorage.map((card, index) => (
                    <Box key={card.nftId}>
                      <DisplayOpenedCards
                        info={card}
                        text={true}
                        isCart={true}
                        onremove={() => {
                          handleRemoveSell(card);
                        }}
                      />
                      <Stack spacing={4}>
                        <InputGroup>
                          <Input
                            type="number"
                            placeholder="price"
                            value={card.price}
                            onChange={(e) => handleOnchangePrice(e, card)}
                          />
                          <InputRightAddon
                            backgroundColor={Theme.colors.primary.base}
                            children="USDT"
                          />
                        </InputGroup>
                      </Stack>
                    </Box>
                  ))}
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Flex>
                <Text>Total: </Text>{' '}
                <Text color="red">
                  {listCardStorage && listCardStorage.length
                    ? listCardStorage.reduce((acc, cur) => +acc + +cur.price, 0)
                    : 0}
                </Text>
              </Flex>
              <Button
                variant="solid"
                colorScheme="red"
                left="1"
                isDisabled={
                  !(
                    listCardStorage &&
                    listCardStorage.length &&
                    listCardStorage.every((i) => i.price && i.price > 0)
                  )
                }
                onClick={handleCreateOrder}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ScaleFadeCustom>
    </>
  );
}

export default Card;
