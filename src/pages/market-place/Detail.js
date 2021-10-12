import { ArrowBackIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Grid,
  GridItem,
  Image,
  List,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Spinner,
  Stack,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
  useTheme,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { FiDisc } from 'react-icons/fi';

import { useEthers } from '@usedapp/core';
import CharacterApi from 'apis/CharacterApi';
import { usePaginator } from 'chakra-paginator';
import DisplayOpenedCards from 'components/DisplayCard';
import Loadable from 'components/Loadable';
import PaginatorCustom from 'components/PaginatorCustom';
import { ethers } from 'ethers';
import React, { lazy } from 'react';
import toast from 'react-hot-toast';
import { FiArrowUp, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { elementDropdown, rarityDropdown } from 'utils/dataFilter';
import Canvas from './Canvas';
import { FwarChar, FwarCharDelegate } from 'dapp/getEthersContract';
import { isMetaMaskInstalled } from 'dapp/metamask';
import { openModalWalletConnect } from 'store/metamaskSlice';
const DisplayCardSelect = Loadable(lazy(() => import('./DisplayCardForUpgrade')));
// const DisplayCardSelect = Loadable(lazy(() => import('./DisplayCardSelect')));

function Detail() {
  const [infoNft, setInfoNft] = React.useState(null);
  const [isMyNft, setIsMyNft] = React.useState(false);

  const [isApprove, setIsApprove] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [needUpgrade, setNeedUpgrade] = React.useState({});
  const [pagesQuantity, setPagesQuantity] = React.useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listSelectCard, setListSelectCard] = React.useState([]);

  const [selected, setSelected] = React.useState([]);
  const [isUpgrade, setIsUpgrade] = React.useState(false);

  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1 }
  });

  const { user } = useSelector((state) => state.user);

  const { account } = useEthers();

  const { id } = useParams();
  const theme = useTheme();
  const { colorMode } = useColorMode();
  let history = useHistory();

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const burnedNfts = selected.map((i) => i.nftId);

      const upgraded = await FwarCharDelegate.upgrade(id, burnedNfts);
      const tx = await upgraded.wait();
      setIsLoading(false);
      setIsUpgrade(false);
      setSelected([]);
      getNftDetail();
      console.log('tx', tx);
    } catch (error) {
      error.data ? toast.error(error.data.message) : toast.error(error.message);
      setIsLoading(false);
    }
  };
  const handleApproveForAll = async () => {
    try {
      setIsLoading(true);
      const result = await FwarChar.setApprovalForAll(FwarCharDelegate.address, true);
      const tx = await result.wait();
      setIsApprove(true);
      setIsLoading(false);
      toast.success('Approve successfully');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  const handleClick = (event, card) => {
    const selectedIndex = selected.indexOf(card);

    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, card);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    const result = newSelected.reduce(function (acc, curr, index) {
      if (typeof acc[curr.rarity] == 'undefined') {
        acc[curr.rarity] = 1;
      } else {
        acc[curr.rarity] += 1;
      }
      return acc;
    }, {});
    for (let i = 1; i <= 4; i++) {
      if (!result[i]) result[i] = 0;
    }
    needUpgrade['junkAmount'] === result['1'] &&
    needUpgrade['normalAmount'] === result['2'] &&
    needUpgrade['rareAmount'] === result['3'] &&
    needUpgrade['baseAmount'] === result['4']
      ? setIsUpgrade(true)
      : setIsUpgrade(false);
    setSelected(newSelected);
  };

  async function getBurnInfo() {
    const nft = getNftDetail();

    if (nft) {
      const burnInfo = await FwarCharDelegate.getBurnInfo(nft.rarity, nft.level);
      const baseAmount = burnInfo['baseAmount'];
      const junkAmount = burnInfo['junkAmount'];
      const normalAmount = burnInfo['normalAmount'];
      const rareAmount = burnInfo['rareAmount'];
      setNeedUpgrade({ baseAmount, junkAmount, normalAmount, rareAmount });
      // console.log('burnInfo', burnInfo);
    }
  }
  async function getNftDetail() {
    const { data: nft } = await CharacterApi.getOne(id);
    setInfoNft(nft);
    return nft;
  }
  React.useEffect(() => {
    getNftDetail();
    if (account) {
      getNftDetail();
      return () => {
        setInfoNft(null); // This worked for me
      };
    }
  }, [account]);

  React.useEffect(() => {
    (async function () {
      if (user && infoNft && isMyNft && infoNft['rarity'] > 3) {
        const rarity = [];
        const burnArray = Object.entries(needUpgrade).filter((i) => i[1] > 0);
        burnArray.forEach((i) => {
          if (i[0] === 'junkAmount') rarity.push(1);
          if (i[0] === 'normalAmount') rarity.push(2);
          if (i[0] === 'rareAmount') rarity.push(3);
          if (i[0] === 'baseAmount') rarity.push(4);
        });
        console.log('rarity', rarity);
        let { data: listCardSelect } = await CharacterApi.getMyList({
          userId: user._id,
          isListed: false,
          teamId: infoNft.teamId._id,
          page: currentPage,
          element: infoNft.element,
          rarity: JSON.stringify(rarity)
        });

        setListSelectCard(listCardSelect.docs);
        setPagesQuantity(listCardSelect.totalPages);
        console.log('listCardSelect', listCardSelect);
      }
      return () => {
        setListSelectCard([]); // This worked for me
      };
    })();
  }, [user, infoNft, needUpgrade]);

  React.useEffect(() => {
    if (account) {
      (async function () {
        try {
          const isApproveForAll = await FwarChar.isApprovedForAll(
            account,
            FwarCharDelegate.address
          );
          setIsApprove(isApproveForAll);

          const ownerOf = await FwarChar.ownerOf(+id);

          if (ownerOf === account) {
            setIsMyNft(true);
          } else {
            setIsMyNft(false);
          }
        } catch (error) {
          setIsMyNft(false);
        }
      })();
    }
    // console.log(FwarChar);
  }, [account, isMyNft, isApprove]);
  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    ctx.fill();
  };
  return (
    <>
      <ScaleFade initialScale={0.9} in>
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
            NFT Details
          </Text>
          <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <Link to="/farm">
                <Text color={theme.colors.primary.base}>Home</Text>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Text>NFT</Text>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Details</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Stack>

        {/*  */}
        <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={10}>
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <Button
              leftIcon={<ArrowBackIcon />}
              // colorScheme="purple"
              variant="solid"
              onClick={() => history.goBack()}
            >
              Back
            </Button>
            {infoNft && <DisplayOpenedCards info={infoNft} text={true} isDetail={true} />}
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 2 }}>
            <Tabs>
              <TabList>
                <Tab>Details</Tab>
                {isMyNft && infoNft && Number(infoNft['rarity']) >= 4 && !infoNft.isListed && (
                  <Tab>Upgrade</Tab>
                )}
                {/* {isMyNft && <Tab>Upgrade</Tab>} */}
              </TabList>

              <TabPanels>
                <TabPanel
                  mt={4}
                  bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  borderRadius="6px"
                >
                  <Box>{infoNft && infoNft['teamId'].name}</Box>
                  <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={10}>
                    <GridItem colSpan={{ base: 12, lg: 5 }}>
                      <List spacing={3} paddingBottom={5}>
                        <ListItem>
                          <ListIcon as={FiDisc} />
                          NFT Token ID = {id}
                        </ListItem>
                        {infoNft && (
                          <>
                            <ListItem>
                              <ListIcon as={FiDisc} />
                              Attack = {Number(infoNft['baseAttack'])}
                              {infoNft.attack > 0 && (
                                <Text color="green" display="inline">
                                  (+{Math.floor(infoNft.attack)})
                                </Text>
                              )}
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiDisc} />
                              Defend = {Number(infoNft['baseDefense'])}
                              {infoNft.defense > 0 && (
                                <Text color="green" display="inline">
                                  (+{Math.floor(infoNft.defense)})
                                </Text>
                              )}
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiDisc} />
                              Health = {Number(infoNft['baseHeath'])}
                              {infoNft.heath > 0 && (
                                <Text color="green" display="inline">
                                  (+{Math.floor(infoNft.heath)})
                                </Text>
                              )}
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiDisc} />
                              Element Type ={' '}
                              {elementDropdown.find((i) => i.value === infoNft['element']).label}
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiDisc} />
                              Level = {Number(infoNft['level'])}
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiDisc} />
                              Rarity ={' '}
                              {rarityDropdown.find((i) => i.value === infoNft['rarity']).label}
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiDisc} />
                              Team = {infoNft['teamId'].name}
                            </ListItem>
                          </>
                        )}
                      </List>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, lg: 7 }}>
                      <Canvas draw={draw} />
                    </GridItem>
                  </Grid>
                </TabPanel>
                <TabPanel
                  mt={4}
                  bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  borderRadius="6px"
                >
                  <Stack direction="row" align="center" justify="space-between">
                    <Box>Upgrade to Level {infoNft && Number(infoNft['level']) + 1}</Box>
                  </Stack>
                  <Stack direction="row" align="center" justify="space-between">
                    <Box>
                      {needUpgrade && Object.keys(needUpgrade).length > 0 && (
                        <>
                          {Object.entries(needUpgrade)
                            .filter((item) => Number(item[1]) > 0)
                            .map((i, index) => (
                              // { i[1] > 0 &&
                              <Stack key={index} direction="row" align="center">
                                <Image
                                  src={`/assets/card/rarity/${
                                    i[0] === 'baseAmount'
                                      ? 4
                                      : i[0] === 'junkAmount'
                                      ? 1
                                      : i[0] === 'normalAmount'
                                      ? 2
                                      : i[0] === 'rareAmount' && 3
                                  }.png`}
                                  w="50px"
                                />
                                <Box>x {i[1]}</Box>
                              </Stack>
                              // }
                            ))}
                        </>
                      )}
                    </Box>
                    <Button leftIcon={<FiPlus />} onClick={onOpen}>
                      Select
                    </Button>
                  </Stack>
                  <Box pt={6}>
                    {isApprove && (
                      <Button
                        // leftIcon={<FiArrowUp />}
                        leftIcon={
                          isLoading ? (
                            <Spinner
                              thickness="5px"
                              speed="0.65s"
                              emptyColor={theme.colors.primary.base}
                              color="blue.500"
                            />
                          ) : (
                            <FiArrowUp />
                          )
                        }
                        w="full"
                        bg={theme.colors.primary.base}
                        color="white"
                        _hover={{ boxShadow: theme.shadows.button }}
                        isDisabled={isLoading || !isUpgrade}
                        onClick={handleUpgrade}
                      >
                        Upgrade
                      </Button>
                    )}

                    {!isApprove && (
                      <Button
                        // leftIcon={<FiArrowUp />}
                        leftIcon={
                          isLoading ? (
                            <Spinner
                              thickness="5px"
                              speed="0.65s"
                              emptyColor={theme.colors.primary.base}
                              color="blue.500"
                            />
                          ) : (
                            <FiArrowUp />
                          )
                        }
                        w="full"
                        bg={theme.colors.primary.base}
                        color="white"
                        _hover={{ boxShadow: theme.shadows.button }}
                        isDisabled={isLoading}
                        onClick={handleApproveForAll}
                      >
                        Approve
                      </Button>
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent overflow="hidden" color={colorMode === 'dark' && 'white'}>
            <ModalHeader
              fontSize="18px"
              bg={colorMode === 'dark' ? theme.colors.dark.bg : theme.colors.light.bg}
            >
              Please select {infoNft && Number(infoNft['level']) + 1} cards
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Card</Th>
                    <Th>Level</Th>
                    <Th>Team</Th>
                    <Th>Rarity</Th>
                    <Th>Element</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {listSelectCard &&
                    infoNft &&
                    listSelectCard
                      .filter((i) => i.nftId !== infoNft['nftId'])
                      .map((card, index) => (
                        <Tr
                          key={card._id}
                          _hover={{
                            cursor: 'pointer',
                            bg:
                              colorMode === 'dark'
                                ? theme.colors.dark.light
                                : theme.colors.light.hover
                          }}
                          onClick={(e) => handleClick(e, card)}
                          bg={
                            selected.length &&
                            selected.includes(card) &&
                            (colorMode === 'dark' ? theme.colors.dark.bg : theme.colors.light.bg)
                          }
                        >
                          <Td>
                            {/* rgb(236 244 252) */}
                            <Link to={`/market-place/detail/${1}`}>
                              <DisplayCardSelect info={card} />
                            </Link>
                          </Td>
                          <Td>{card.level}</Td>
                          <Td>{card.teamId.name}</Td>
                          <Td>{card.rarity}</Td>
                          <Td>{elementDropdown.find((i) => i.value === card.element).label}</Td>
                        </Tr>
                      ))}
                </Tbody>
              </Table>
            </ModalBody>

            <ModalFooter>
              {/* <Button colorScheme="blue" w="full" mr={3} onClick={onClose}>
              Close
            </Button> */}
              <Box w="100%">
                <PaginatorCustom
                  pagesQuantity={pagesQuantity}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </Box>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ScaleFade>
    </>
  );
}

export default Detail;
