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
  useTheme
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import CharacterApi from 'apis/CharacterApi';
import { usePaginator } from 'chakra-paginator';
import DisplayOpenedCards from 'components/DisplayCard';
import PaginatorCustom from 'components/PaginatorCustom';
import FwarCharJson from 'contracts/FwarChar/FWarChar.json';
import FwarCharDelegateJson from 'contracts/FwarChar/FwarCharDelegate.json';
import { ethers } from 'ethers';
import React from 'react';
import toast from 'react-hot-toast';
import { FiArrowUp, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { elementDropdown, rarityDropdown } from 'utils/dataFilter';
import DisplayCardSelect from './DisplayCardSelect';
import ItemListComponent from './ItemListComponent';

function Detail() {
  const [infoNft, setInfoNft] = React.useState(null);
  const [isMyNft, setIsMyNft] = React.useState(false);

  const [isApprove, setIsApprove] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [needUpgrade, setNeedUpgrade] = React.useState({});
  const [pagesQuantity, setPagesQuantity] = React.useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listSelectCard, setListSelectCard] = React.useState([]);
  const [listSelectCardId, setListSelectCardId] = React.useState([]);

  const [selected, setSelected] = React.useState([]);

  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1 }
  });

  const { user } = useSelector((state) => state.user);

  const { account } = useEthers();

  const { id } = useParams();
  const theme = useTheme();
  const { colorMode } = useColorMode();
  let history = useHistory();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const FwarChar = new ethers.Contract(FwarCharJson.networks[97].address, FwarCharJson.abi, signer);
  const FwarCharDelegate = new ethers.Contract(
    FwarCharDelegateJson.networks[97].address,
    FwarCharDelegateJson.abi,
    signer
  );

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const burnedNfts = selected.map((i) => listSelectCard[i].nftId);

      const upgraded = await FwarCharDelegate.upgrade(id, burnedNfts);
      const tx = await upgraded.wait();
      setIsLoading(false);

      console.log('burnedNfts', burnedNfts);
      console.log('upgraded', upgraded);
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
      setIsLoading(false);
      toast.success('Approve successfully');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };
  const handleClick = (event, index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
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
    console.log('newSelected', newSelected);
    setSelected(newSelected);
  };
  React.useEffect(() => {
    if (account) {
      const init = async () => {
        const { data: nft } = await CharacterApi.getOne(id);
        setInfoNft(nft);
        console.log('nft', nft);
        if (nft) {
          const burnInfo = await FwarCharDelegate.getBurnInfo(nft.rarity, nft.level);
          const baseAmount = burnInfo['baseAmount'];
          const junkAmount = burnInfo['junkAmount'];
          const normalAmount = burnInfo['normalAmount'];
          const rareAmount = burnInfo['rareAmount'];
          setNeedUpgrade({ baseAmount, junkAmount, normalAmount, rareAmount });
          // console.log('burnInfo', { baseAmount, junkAmount, normalAmount, rareAmount });
        }
      };
      init();
      return () => {
        setInfoNft(null); // This worked for me
      };
    }
  }, [setInfoNft, account, setNeedUpgrade]);
  React.useEffect(() => {
    (async function () {
      if (user && infoNft) {
        const { data: listCardSelect } = await CharacterApi.getMyList({
          userId: user._id,
          isListed: false,
          teamId: infoNft.teamId,
          page: currentPage
        });
        setListSelectCard(listCardSelect.docs);
        setPagesQuantity(listCardSelect.totalPages);
        // console.log('teamId', infoNft.teamId._id);
        // const listSelect = listCard.filter((card, index) => {
        //   if (
        //     Number(card['level']) === 1 &&
        //     Number(card['rarity']) === 1 &&
        //     Number(card['teamId']) === Number(info['teamId']) &&
        //     Number(card['elementType']) === Number(info['elementType'])
        //   ) {
        //     listSelectIdIndex.push(index);
        //   }

        //   return (
        //     Number(card['level']) === 1 &&
        //     Number(card['rarity']) === 1 &&
        //     Number(card['teamId']) === Number(info['teamId']) &&
        //     Number(card['elementType']) === Number(info['elementType']) &&
        //     true
        //   );
        // });
        // let listSelectId = listSelectIdIndex.map((i) => listCardIds[i]);

        // setListSelectCardId(listSelectId);
        // console.log('list select card', listSelectCard);
        // console.log('listSelectId', listSelectId);
        // console.log('listCardIds', listCardIds);
        console.log('listCardSelect', listCardSelect);
      }
      return () => {
        setListSelectCard([]); // This worked for me
        setListSelectCardId([]); // This worked for me
      };
    })();
  }, [user, infoNft]);

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
          }
        } catch (error) {
          setIsMyNft(false);
        }
      })();
    }
    // console.log(FwarChar);
  }, [account, isMyNft, isApprove]);
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
                <Box>{infoNft && infoNft['teamId'].cardName}</Box>
                <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={10}>
                  <GridItem colSpan={{ base: 12, lg: 5 }}>
                    <List spacing={3} paddingBottom={5}>
                      <ItemListComponent name="NFT Token ID" value={id} />
                      {infoNft && (
                        <>
                          <ItemListComponent name="Attack" value={Number(infoNft['baseAttack'])} />
                          <ItemListComponent name="Defend" value={Number(infoNft['baseDefense'])} />
                          <ItemListComponent name="Health" value={Number(infoNft['baseHeath'])} />
                          <ItemListComponent
                            name="Element Type"
                            value={
                              elementDropdown.find((i) => i.value === infoNft['element']).label
                            }
                          />
                          <ItemListComponent name="Level" value={infoNft['level']} />
                          <ItemListComponent
                            name="Rarity"
                            value={rarityDropdown.find((i) => i.value === infoNft['rarity']).label}
                          />
                          <ItemListComponent name="Team" value={infoNft['teamId'].name} />
                        </>
                      )}
                      {/* <ItemListComponent name="Level" value={id} /> */}
                      {/* <ItemListComponent name="HashPower" value={id} /> */}
                    </List>
                  </GridItem>
                  <GridItem colSpan={{ base: 12, lg: 7 }}>canvas </GridItem>
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
                  {/* <Grid templateColumns="repeat(4, 1fr)" gap={2} align="center">
                    {Object.keys(needUpgrade).length && (
                      <>
                        <Box>
                          Base Amount<Text>{needUpgrade['baseAmount']}</Text>
                        </Box>
                        <Box>
                          Junk Amount<Text>{needUpgrade['junkAmount']}</Text>
                        </Box>
                        <Box>
                          Normal Amount<Text>{needUpgrade['normalAmount']}</Text>
                        </Box>
                        <Box>
                          Rare Amount<Text>{needUpgrade['rareAmount']}</Text>
                        </Box>
                      </>
                    )}
                  </Grid> */}
                </Stack>
                <Stack direction="row" align="center" justify="space-between">
                  <Box>
                    {needUpgrade && Object.keys(needUpgrade).length > 0 && (
                      <>
                        {Object.entries(needUpgrade).map((i, index) => (
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
                        ))}
                      </>
                    )}
                  </Box>
                  <Button leftIcon={<FiPlus />} onClick={onOpen}>
                    Select
                  </Button>
                </Stack>
                <Box pt={6}>
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
                    _hover={{ bg: theme.colors.primary.light }}
                    isDisabled={isLoading || (selected && !selected.length > 0)}
                    onClick={() => {
                      isApprove ? handleUpgrade() : handleApproveForAll();
                    }}
                  >
                    {isApprove ? `Upgrade` : `Approve`}
                  </Button>
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
                  listSelectCard.map((card, index) => (
                    <Tr
                      key={card._id}
                      _hover={{
                        cursor: 'pointer',
                        bg: colorMode === 'dark' ? theme.colors.dark.light : theme.colors.light.bg
                      }}
                      onClick={(e) => handleClick(e, index)}
                      bg={
                        selected.length &&
                        selected.includes(index) &&
                        (colorMode === 'dark' ? theme.colors.dark.bg : theme.colors.light.base)
                      }
                    >
                      <Td>
                        {/* rgb(236 244 252) */}
                        <Link to={`/market-place/detail/${1}`}>
                          <DisplayCardSelect info={card} text={true} />
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
    </>
  );
}

export default Detail;
