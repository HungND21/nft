import {
  Box,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useDisclosure,
  useTheme,
  VStack
} from '@chakra-ui/react';
import CharacterApi from 'apis/CharacterApi';
import PlayerApi from 'apis/PlayerApi';

import { usePaginator } from 'chakra-paginator';
import ButtonSelect from 'components/ButtonSelect';
import Loadable from 'components/Loadable';
import PaginatorCustom from 'components/PaginatorCustom';
import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import { elementDropdown } from 'utils/dataFilter';
import toast from 'react-hot-toast';

import CardClose from './CardClose';
import DisplayCard from './DisplayCard';

const DisplayCardSelect = Loadable(lazy(() => import('./DisplayCard')));

function ChooseTeamComponent({ user, cardType }) {
  const [listSelectCard, setListSelectCard] = React.useState([]);
  const [pagesQuantity, setPagesQuantity] = React.useState(1);
  const [selected, setSelected] = React.useState([]);
  const [teamChoose, setTeamChoose] = React.useState([]);

  const { colorMode } = useColorMode();
  const theme = useTheme();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1 }
  });
  const getListCard = async () => {
    const { data: listCardSelect } = await CharacterApi.getMyList({
      userId: user._id,
      isListed: false,
      page: currentPage,
      rarity: 4,
      typeCard: cardType
    });

    setListSelectCard(listCardSelect.docs);
    setPagesQuantity(listCardSelect.totalPages);
    console.log('listCardSelect', listCardSelect.docs);
  };
  const getTeam = async () => {
    const { data } = await PlayerApi.getTeam(user._id);
    return data;
  };
  const getTeamRegistration = async () => {
    const teamReg = await getTeam();
    if (teamReg) {
      if (cardType === 'attacker') {
        // setSelected(teamReg.attackTeam);
        setTeamChoose(teamReg.attackTeam);
      } else {
        // setSelected(teamReg.defenseTeam);
        setTeamChoose(teamReg.defenseTeam);
      }
    }
  };
  React.useEffect(() => {
    if (user) {
      (async () => {
        const teamReg = await getTeam();
        if (teamReg) {
          if (cardType === 'attacker') {
            setSelected(teamReg.attackTeam);
            // setTeamChoose(teamReg.attackTeam);
          } else {
            setSelected(teamReg.defenseTeam);
            // setTeamChoose(teamReg.defenseTeam);
          }
        }
      })();
    }
  }, [user]);

  React.useEffect(() => {
    (async function () {
      if (user) {
        getListCard();
        getTeamRegistration();
      }
      return () => {
        setListSelectCard([]); // This worked for me
      };
    })();
  }, [user, currentPage, setTeamChoose]);
  const handleClick = (event, card) => {
    const selectedIndex = selected.map((i) => i.nftId).indexOf(card.nftId);
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
    if (newSelected.length > 3) {
      toast.error('Please select at most 3');
    } else {
      setSelected(newSelected);
    }
    // console.log('selectedIndex', selectedIndex);
  };
  // console.log('selected', selected);

  const handleSubmitTeam = async (event) => {
    try {
      let newPlayer = {};
      if (cardType === 'attacker') {
        const attackTeam = selected.map((item) => item._id);
        newPlayer = { userId: user._id, attackTeam };
      } else {
        const defenseTeam = selected.map((item) => item._id);
        newPlayer = { userId: user._id, defenseTeam };
      }
      console.log('newPlayer', newPlayer);
      const { data } = await PlayerApi.registration(newPlayer);
      getTeamRegistration();
      toast.success(data);
    } catch (error) {
      if (error.data) {
        toast.error(error.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };
  return (
    <>
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
            {cardType}
          </Text>
          <Text fontSize="21px" fontWeight="medium">
            ( +3 Cards )
          </Text>
          {teamChoose && !teamChoose.length && (
            <Grid templateColumns="repeat(3, 1fr)" gap={5} px={20} py={3}>
              <CardClose />
              <CardClose />
              <CardClose />
            </Grid>
          )}
          {teamChoose && teamChoose.length && (
            <Grid templateColumns="repeat(3, 1fr)" gap={5} px={20} py={3}>
              {teamChoose.map((card) => (
                <DisplayCard key={card._id} info={card} text={true} mini={true} />
              ))}
            </Grid>
          )}
          <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={5}>
            <ButtonSelect onClick={onOpen} title="select" />

            <ButtonSelect
              onClick={handleSubmitTeam}
              title="registration"
              isDisabled={selected && selected.length < 3}
            />
          </Grid>
        </VStack>
      </VStack>

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
                        selected &&
                        selected.length &&
                        selected.map((i) => i.nftId).includes(card.nftId) &&
                        (colorMode === 'dark' ? theme.colors.dark.bg : theme.colors.light.bg)
                      }
                    >
                      <Td w="20%">
                        {/* rgb(236 244 252) */}
                        <DisplayCardSelect info={card} text={true} mini={true} />
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
                onPageChange={setCurrentPage}
              />
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChooseTeamComponent;
