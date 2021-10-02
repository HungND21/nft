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
import FwarCharJson from 'contracts/FwarChar/FWarChar.json';
import FwarCharDelegateJson from 'contracts/FwarChar/FwarCharDelegate.json';
import { ethers } from 'ethers';
import React from 'react';
import toast from 'react-hot-toast';
import { FiArrowUp, FiPlus } from 'react-icons/fi';
import { Link, useHistory, useParams } from 'react-router-dom';
import ItemListComponent from './ItemListComponent';
import DisplayOpenedCards from 'components/Card';
function Detail() {
  const [infoNft, setInfoNft] = React.useState(null);
  const [isMyNft, setIsMyNft] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listSelectCard, setListSelectCard] = React.useState([]);
  const [listSelectCardId, setListSelectCardId] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

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
    // listSelectCardId.
    // console.log('burnedNfts', burnedNfts);
    // console.log('result', baseAmount, junkAmount, normalAmount, rareAmount);
    console.log('rarity', infoNft.rarity);
    console.log('level', infoNft.level);

    // const burnedNfts = selected.map((i) => listSelectCardId[i]);
    const upgraded = await FwarCharDelegate.upgrade('2238', ['887']);
    console.log('upgraded', upgraded);
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
    if (newSelected.length > 2) {
      toast.error('select 2 cards');
    } else {
      setSelected(newSelected);
    }
  };
  React.useEffect(() => {
    if (account) {
      const init = async () => {
        const { data: nft } = await CharacterApi.getOne(id);
        setInfoNft(nft);

        // const burnInfo = await FwarCharDelegate.getBurnInfo(infoNft.rarity, infoNft.level);
        // const baseAmount = burnInfo['baseAmount'];
        // const junkAmount = burnInfo['junkAmount'];
        // const normalAmount = burnInfo['normalAmount'];
        // const rareAmount = burnInfo['rareAmount'];
        // const listCardSelec = await CharacterApi.getMyList(
        //   infoNft.level,
        //   baseAmount,
        //   junkAmount,
        //   normalAmount,
        //   rareAmount
        // );
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
        // setListSelectCard(listSelect);
        // setListSelectCardId(listSelectId);
        // console.log('list select card', listSelectCard);
        // console.log('listSelectId', listSelectId);
        // console.log('listCardIds', listCardIds);
      };
      init();
      return () => {
        setInfoNft(null); // This worked for me
        setListSelectCard([]); // This worked for me
        setListSelectCardId([]); // This worked for me
      };
    }
  }, [setInfoNft, account]);

  React.useEffect(() => {
    if (account) {
      (async function () {
        try {
          // console.log('cardByIndex');
          const ownerOf = await FwarChar.ownerOf(+id);
          if (ownerOf === account) setIsMyNft(true);
          console.log('cardByIndex', ownerOf);
        } catch (error) {
          setIsMyNft(false);
        }
      })();
    }
    // console.log(FwarChar);
  }, [account, setIsMyNft]);
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
            colorScheme="purple"
            variant="solid"
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          {infoNft && <DisplayOpenedCards info={infoNft} text={true} />}
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 2 }}>
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              {isMyNft && infoNft && Number(infoNft['rarity']) >= 4 && <Tab>Upgrade</Tab>}
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
                          <ItemListComponent
                            name="Attack"
                            value={Number(infoNft['baseAttack']) / 1000}
                          />
                          <ItemListComponent
                            name="Defend"
                            value={Number(infoNft['baseDefense']) / 1000}
                          />
                          <ItemListComponent
                            name="Health"
                            value={Number(infoNft['baseHeath']) / 1000}
                          />
                          <ItemListComponent name="Element Type" value={infoNft['element']} />
                          <ItemListComponent name="Level" value={infoNft['level']} />
                          <ItemListComponent name="Rarity" value={infoNft['rarity']} />
                          <ItemListComponent name="Team Id" value={infoNft['teamId'].teamId} />
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
                <Box>Upgrade to Level {infoNft && Number(infoNft['level']) + 1}</Box>
                <Stack direction="row" align="center" justify="space-between">
                  <Stack direction="row">
                    <Image src="/assets/water.png" w="50px" />
                    <Image src="/assets/water.png" w="50px" marginLeft="0" />
                  </Stack>
                  <Button leftIcon={<FiPlus />} onClick={onOpen}>
                    Select
                  </Button>
                </Stack>
                <Box pt={6}>
                  <Button
                    leftIcon={<FiArrowUp />}
                    w="full"
                    bg={theme.colors.primary.base}
                    color="white"
                    _hover={{ bg: theme.colors.primary.light }}
                    // isDisabled={selected.length === 1}
                    onClick={() => handleUpgrade()}
                  >
                    Upgrade
                  </Button>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please select {infoNft && Number(infoNft['level']) + 1} cards</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Card</Th>
                  <Th>Level</Th>
                  <Th>Team Id</Th>
                  <Th>Rarity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {listSelectCard &&
                  listSelectCard.map((card, index) => (
                    <Tr
                      key={index}
                      _hover={{ bg: theme.colors.secondary.light }}
                      onClick={(e) => handleClick(e, index)}
                      bg={selected.length && selected.includes(index) && '#ECF4FC'}
                    >
                      <Td>
                        {/* rgb(236 244 252) */}
                        <Link to={`/market-place/detail/${1}`}>
                          <Box position="relative" w="80px">
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
                              p="14% 8% 3%"
                              color="white"
                              align="center"
                              fontSize={10}
                            >
                              {/* <Text lineHeight="10px">NFT {1}</Text> */}
                              <Text lineHeight="10px">{card['teamId'].cardName}</Text>
                            </Box>
                          </Box>
                        </Link>
                      </Td>
                      <Td>{Number(card['level'])}</Td>
                      <Td>{Number(card['teamId'])}</Td>
                      <Td>{Number(card['rarity'])}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" w="full" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Detail;
