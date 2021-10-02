import React from 'react';
import { Link } from 'react-router-dom';

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
  useTheme,
  Spinner
} from '@chakra-ui/react';
import { Container, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator';
import { CgShoppingCart } from 'react-icons/cg';
import toast from 'react-hot-toast';
import Select from 'react-select';

import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import FwarCharJson from 'contracts/FwarChar/FWarChar.json';
import FwarMarketDelegateJson from 'contracts/FwarMarket/FwarMarketDelegate.json';
import UsdtJson from 'contracts/Usdt.json';

import { useSelector } from 'react-redux';

// import Card from 'components/Card';
import DisplayOpenedCards from 'components/Card';
// api
import OrderApi from 'apis/OrderApi';
import CharacterApi from 'apis/CharacterApi';
import UserApi from 'apis/UserApi';
import TeamApi from 'apis/TeamApi';
const rarityDropdown = [
  // { value: '', label: 'All' },
  { value: '1', label: 'Junk' },
  { value: '2', label: 'Normal' },
  { value: '3', label: 'Rare' },
  { value: '4', label: 'Epic' }
  // { value: '5', label: 'Legend' }
];

const elementDropdown = [
  // { value: '', label: 'All' },
  { value: '1', label: 'Metal' },
  { value: '2', label: 'Wood' },
  { value: '3', label: 'Water' },
  { value: '4', label: 'Fire' },
  { value: '5', label: 'Earth' }
];
// const teamDropdown = [
//   // { value: '', label: 'All' },
//   { value: '0', label: 'Banana' },
//   { value: '1', label: 'Coconut' },
//   { value: '2', label: 'Orange' },
//   { value: '3', label: 'CustardApple' },
//   { value: '4', label: 'Durian' },
//   { value: '5', label: 'Grape' },
//   { value: '6', label: 'PineApple' },
//   { value: '7', label: 'Pomegranate' },
//   { value: '8', label: 'Watermelon' },
//   { value: '9', label: 'PassionFruit' },
//   { value: '10', label: 'Barbariant' },
//   { value: '11', label: 'Bommant' },
//   { value: '12', label: 'Archeriant' },
//   { value: '13', label: 'Cannonian' },
//   { value: '14', label: 'Slinger' },
//   { value: '15', label: 'HunterMant' },
//   { value: '16', label: 'Magiciant' },
//   { value: '17', label: 'Normal' },
//   { value: '18', label: 'Swordmant' },
//   { value: '19', label: 'Tank' }
// ];

function Card() {
  const Theme = useTheme();
  const { colorMode } = useColorMode();
  const { account } = useEthers();
  // redux
  const { user } = useSelector((state) => state.user);
  // paginate
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1, pageSize: 5 }
  });
  //
  const [rarityState, setRarityState] = React.useState('');
  const [elementState, setElementState] = React.useState('');
  const [teamIdState, setTeamIdState] = React.useState('');
  //

  const [teamDropdown, setTeamDropdown] = React.useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isApprove, setIsApprove] = React.useState(false);

  const [listCardState, setListCardState] = React.useState([]); // list card
  const [listCardStorage, setListCardStorage] = React.useState([]); // card
  const [price, setPrice] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [listMyOrder, setListMyOrder] = React.useState([]);

  const [pagesQuantity, setPagesQuantity] = React.useState(1);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const FwarChar = new ethers.Contract(FwarCharJson.networks[97].address, FwarCharJson.abi, signer);
  const FwarMarketDelegate = new ethers.Contract(
    FwarMarketDelegateJson.networks[97].address,
    FwarMarketDelegateJson.abi,
    signer
  );

  // console.log('UsdtJson', UsdtJson);
  //
  const handleSell = (card) => {
    console.log('card storage', card);
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
      // setListCardStorage(listCartArray);
    }
  };

  const handleRemoveSell = (card) => {
    const listCardFilter = listCardStorage.filter((i) => i.nftId !== card.nftId);
    localStorage.setItem('cardItem', JSON.stringify(listCardFilter));
    setListCardStorage(listCardFilter);
    toast.success('remove card');
  };
  const handleOnchangePrice = (e, nftId) => {
    if (Object.keys(price).length !== 0) {
      setPrice({ ...price, [nftId]: e.target.value });
      localStorage.setItem('price', JSON.stringify({ ...price, [nftId]: e.target.value }));
    } else {
      setPrice({ [nftId]: e.target.value });
      localStorage.setItem('price', JSON.stringify({ [nftId]: e.target.value }));
    }
  };

  const handleCreateOrder = async () => {
    if (price) {
      try {
        setIsLoading(true);
        onClose();
        const expiration = 2 * 24 * 60 * 60;
        const totalPriceOrder = Object.values(price).reduce((acc, cur) => +acc + +cur, 0);
        // address Fwar, uint[], token Usdt
        console.log('totalPriceOrder', totalPriceOrder);
        console.log('listCardStorage', listCardStorage);
        const listCardOrderId = listCardStorage.map((i) => i.nftId);
        const result = await FwarMarketDelegate.createOrder(
          FwarChar.address,
          listCardOrderId,
          UsdtJson.networks[97].address, // usdtAddress
          ethers.BigNumber.from(1e9).pow(2).mul(totalPriceOrder),
          expiration
        );
        const tx = await result.wait();
        const args = tx.events[0]['args'];
        const dataNewOrder = {
          orderId: args['_orderId']._hex,
          userId: user._id,
          nftIds: listCardStorage.map((i) => i._id),
          nftContract: args['_nftContract'],
          token: args['_token'],
          price: Number(ethers.utils.formatEther(args['_price']._hex)),
          expiration: Number(args['_expiration'])
        };
        const { data: newOrder } = await OrderApi.add(dataNewOrder);
        // console.log('newOrder', newOrder);
        // console.log('info order', dataNewOrder);
        toast.success(newOrder.message);
        localStorage.removeItem('cardItem');
        localStorage.removeItem('price');
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
      setIsLoading(true);
      const isApproveForAll = await FwarChar.isApprovedForAll(owner, operator);
      // ethers.BigNumber.from(1e6).pow(3).mul(1000000)

      if (isApproveForAll) {
        console.log(isApproveForAll);
      } else {
        const result = await FwarChar.setApprovalForAll(operator, true);
        const { events } = await result.wait();
        const approved = events[0].args['approved'];
        if (approved) {
          setIsApprove(true);
          toast.success('approve for all successfully!');
        } else {
          setIsApprove(false);
          toast.error('approve for all failed!');
        }
        setIsLoading(false);
      }
    }
  };

  const listMyOrderInit = async () => {
    if (user) {
      const { data: myOrder } = await OrderApi.getMyOrder(user._id);
      console.log('ListMyOrder', myOrder.docs);
      setListMyOrder(myOrder.docs);
    }
  };
  const approveInit = async () => {
    const isApproveForAll = await FwarChar.isApprovedForAll(
      account,
      FwarMarketDelegateJson.networks[97].address
    );
    if (isApproveForAll) setIsApprove(true);
  };
  const getMyCard = async (rarity, element, teamId) => {
    if (user) {
      const { data: listCard } = await CharacterApi.getMyList(
        user._id,
        currentPage,
        rarity,
        element,
        teamId
      );
      setListCardState(listCard.docs);
      console.log('listCard', listCard.docs);
      setPagesQuantity(listCard.totalPages);
    }
  };

  //Get Team Dropdown
  const getTeams = async () => {
    const { data: listTeams } = await TeamApi.getALl();
    const teams = listTeams.map((i) => ({ value: i._id, label: i.name }));
    console.log('listTeams', listTeams);
    setTeamDropdown(teams);
  };

  const handleChangeRarity = (rarity) => {
    console.log('rarity', rarity);
    setRarityState(rarity);
  };
  const handleChangeElement = (element) => {
    console.log('element', element);

    setElementState(element);
  };
  const handleChangeTeamId = (teamId) => {
    console.log('teamId', teamId);

    setTeamIdState(teamId);
  };

  React.useEffect(() => {
    const listCartLocalStorageJson = localStorage.getItem('cardItem');
    const priceLocal = JSON.parse(localStorage.getItem('price'));
    if (priceLocal) setPrice(priceLocal);

    if (listCartLocalStorageJson) {
      const listCartParse = JSON.parse(listCartLocalStorageJson);
      if (listCartParse.length) {
        setListCardStorage(listCartParse);
      }
    }

    if (account) {
      approveInit();
      listMyOrderInit();
      getMyCard(rarityState, elementState, teamIdState);
      getTeams();
      return () => {
        setListCardStorage();
        setListMyOrder([]);
        setIsApprove();
      };
    }
  }, [account, currentPage, user, setListCardStorage, rarityState, elementState, teamIdState]);

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
      <Box
        bg={colorMode === 'dark' ? Theme.colors.dark.light : 'white'}
        p={8}
        boxShadow="content"
        borderRadius={8}
        position="relative"
      >
        <Grid templateColumns="repeat(6, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 6, md: 5 }}>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
                <Select
                  onChange={handleChangeRarity}
                  value={rarityState}
                  options={rarityDropdown}
                  isClearable
                  placeholder="Rarity"
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: '4px',
                    colors: {
                      ...theme.colors,
                      primary25: '#d6d3ff',
                      primary: Theme.colors.primary.base
                    }
                  })}
                />
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
                <Select
                  onChange={handleChangeElement}
                  value={elementState}
                  options={elementDropdown}
                  isClearable
                  placeholder="Element"
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: '4px',
                    colors: {
                      ...theme.colors,
                      primary25: '#d6d3ff',
                      primary: Theme.colors.primary.base
                    }
                  })}
                />
              </GridItem>
              <GridItem colSpan={{ base: 4, md: 2, lg: 1 }}>
                <Select
                  onChange={handleChangeTeamId}
                  value={teamIdState}
                  options={teamDropdown}
                  isClearable
                  placeholder="Team"
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: '4px',
                    colors: {
                      ...theme.colors,
                      primary25: '#d6d3ff',
                      primary: Theme.colors.primary.base
                    }
                  })}
                />
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 1 }}>
            <Box position="relative" align="right">
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
                <DisplayOpenedCards info={card} />
                <Stack
                  direction="column"
                  align="center"
                  justify="center"
                  bg="rgba(240, 232, 251, 0.8)"
                  w="100%"
                  h="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  visibility="hidden"
                  _groupHover={{ visibility: 'visible', color: 'orange' }}
                >
                  <Link to={`/market-place/detail/${card.nftId}`}>
                    <Button>Detail</Button>
                  </Link>
                  {isApprove ? (
                    // ------ isApprove = true

                    (!listMyOrder.length ||
                      !listMyOrder.find((i) => i.nftIds.find((id) => id === card._id))) &&
                    (listCardStorage &&
                    listCardStorage.length &&
                    listCardStorage.find((i) => i.nftId === card.nftId) ? (
                      <Button onClick={() => handleRemoveSell(card)}>remove sell</Button>
                    ) : (
                      <Button onClick={() => handleSell(card)}>sell</Button>
                    ))
                  ) : (
                    // ------- isApprove = false
                    <Button
                      onClick={() =>
                        handleApprove(
                          FwarChar,
                          account,
                          FwarMarketDelegateJson.networks[97].address
                        )
                      }
                    >
                      Approve
                    </Button>
                  )}
                  {listMyOrder.length > 0 &&
                    listMyOrder.find((i) => i.nftIds.find((id) => id === card._id)) && (
                      <Text fontSize="3xl" fontWeight="bold">
                        Listed
                      </Text>
                    )}
                </Stack>
              </Box>
            ))}
        </Grid>
      </Box>
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
      {/* loading*/}
      {isLoading && (
        <Stack
          direction="row"
          justify="center"
          align="center"
          position="absolute"
          top="0"
          width="100%"
          height="100%"
          zIndex="10"
        >
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Stack>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent w="1000px">
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid
              templateColumns={{
                base: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(6, 1fr)'
              }}
              gap={6}
              mt={6}
            >
              {listCardStorage &&
                listCardStorage.length > 0 &&
                listCardStorage.map((card, index) => (
                  <Box key={card.nftId}>
                    <DisplayOpenedCards info={card} />
                    <Stack spacing={4}>
                      <InputGroup>
                        <Input
                          type="number"
                          placeholder="price"
                          value={
                            Object.keys(price).length !== 0 && price[card.nftId]
                              ? price[card.nftId]
                              : ''
                          }
                          onChange={(e) => handleOnchangePrice(e, card.nftId)}
                        />
                        <InputRightAddon children="Usdt" />
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
                {Object.keys(price).length
                  ? Object.values(price).reduce((acc, cur) => +acc + +cur, 0)
                  : 0}
              </Text>
            </Flex>
            <Button variant="ghost" onClick={handleCreateOrder}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Card;
