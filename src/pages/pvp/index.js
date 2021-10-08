import React, { lazy } from 'react';
import {
  Grid,
  useTheme,
  VStack,
  Stack,
  Button,
  Text,
  useColorMode,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useEthers } from '@usedapp/core';
import { usePaginator } from 'chakra-paginator';

import Header from './Header';
import CardClose from './CardClose';
import ButtonSelect from 'components/ButtonSelect';
import ScaleFadeCustom from 'components/ScaleFadeCustom';
import CharacterApi from 'apis/CharacterApi';
import DisplayOpenedCards from 'components/DisplayCard';
import Loadable from 'components/Loadable';
import { Link } from 'react-router-dom';
import { elementDropdown, rarityDropdown } from 'utils/dataFilter';
import PaginatorCustom from 'components/PaginatorCustom';

const DisplayCardSelect = Loadable(lazy(() => import('./DisplayCard')));

function Pvp() {
  const { user } = useSelector((state) => state.user);
  const { account } = useEthers();

  const [listSelectCard, setListSelectCard] = React.useState([]);
  const [pagesQuantity, setPagesQuantity] = React.useState(1);

  const [selected, setSelected] = React.useState([]);

  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1 }
  });
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

    setSelected(newSelected);
  };
  console.log(currentPage);
  const showListAttack = async () => {
    getListCard('attacker');
    onOpen();
  };
  const showListDefender = async () => {
    getListCard('defender');
    onOpen();
  };
  const getListCard = async (cardType) => {
    const { data: listCardSelect } = await CharacterApi.getMyList({
      userId: user._id,
      isListed: false,
      page: currentPage,
      rarity: 4,
      typeCard: cardType,
      limit: 5
    });
    setListSelectCard(listCardSelect.docs);
    setPagesQuantity(listCardSelect.totalPages);
    console.log('listCardSelect', listCardSelect);
  };
  // React.useEffect(() => {
  //   (async function () {
  //     if (user) {
  //       getListCard('attacker');
  //     }
  //     return () => {
  //       setListSelectCard([]); // This worked for me
  //     };
  //   })();
  // }, [user]);
  // React.useEffect(() => {
  //   (async function () {
  //     if (user) {
  //       getListCard('defender');
  //     }
  //     return () => {
  //       setListSelectCard([]); // This worked for me
  //     };
  //   })();
  // }, [user]);
  return (
    <>
      <ScaleFadeCustom>
        <Header />
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={5}>
          <VStack spacing="8">
            <VStack
              w="100%"
              spacing="1"
              p={5}
              bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
              borderRadius="8px"
              boxShadow={theme.shadows.content}
            >
              <Text fontSize="30px" fontWeight="bold">
                Attack
              </Text>
              <Text fontSize="21px" fontWeight="medium">
                ( +5 Cards )
              </Text>
              <Grid templateColumns="repeat(5, 1fr)" gap={5} px={20} py={3}>
                <CardClose />
                <CardClose />
                <CardClose />
                <CardClose />
                <CardClose />
              </Grid>
              <ButtonSelect onClick={() => showListAttack()} />
            </VStack>
            <VStack
              w="100%"
              spacing="1"
              p={5}
              bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
              borderRadius="8px"
              boxShadow={theme.shadows.content}
            >
              <Text fontSize="30px" fontWeight="bold">
                Defense
              </Text>
              <Text fontSize="21px" fontWeight="medium">
                ( +5 Cards )
              </Text>
              <Grid templateColumns="repeat(5, 1fr)" gap={5} px={10} py={5}>
                <CardClose />
                <CardClose />
                <CardClose />
                <CardClose />
                <CardClose />
              </Grid>
              <ButtonSelect onClick={() => showListDefender()} />
            </VStack>
          </VStack>
          <Stack
            align="center"
            justify="center"
            p={5}
            bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
            borderRadius="8px"
          >
            <Image src="/assets/bg-nh.png" />
          </Stack>
        </Grid>

        <Box pos="relative" my={10} pb={10}>
          <Image src="/assets/bg-game.png" />
          <Box
            pos="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -62%)"
            cursor="pointer"
            onClick={() => console.log(2)}
          >
            <Image src="/assets/icon-submit.png" />
          </Box>
        </Box>
        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalOverlay />
          <ModalContent w="1000px">
            <ModalHeader>Package for sale</ModalHeader>
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
                        onClick={(e) => handleClick(e, card)}
                        bg={
                          selected.length &&
                          selected.includes(card) &&
                          (colorMode === 'dark' ? theme.colors.dark.bg : theme.colors.light.base)
                        }
                      >
                        <Td w="20%">
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
      </ScaleFadeCustom>
    </>
  );
}

export default Pvp;
