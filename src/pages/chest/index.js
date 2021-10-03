import React from 'react';
import moment from 'moment';
// react
// lib ui

import {
  Box,
  Button,
  Grid,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
  useTheme,
  Icon
} from '@chakra-ui/react';
import { Container, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// smart contract
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import FwarChar from 'contracts/FwarChar/FWarChar.json';
import FwarCharDelegate from 'contracts/FwarChar/FwarCharDelegate.json';

import { default as FwarKey, default as FwarKeyContract } from 'contracts/FwarKey/FWarKey.json';
import { useAllMyKey, useTitle } from 'dapp/hook';
import toast from 'react-hot-toast';
import { FiKey, FiRefreshCcw, FiUnlock, FiEye } from 'react-icons/fi';
// api
// import CharacterApi from 'apis/CharacterApi';
import OpenChestHistoryApi from 'apis/OpenChestHistoryApi';
// import TeamApi from 'apis/TeamApi';
// file project
import OpenedCards from './OpenedCards';
import DisplayOpenedCards from 'components/DisplayCard';
import { formatDate } from 'utils/formatDate';

const ChestInit = () => {
  useTitle('FWAR - OPEN CHEST');

  const [amount, setAmount] = React.useState('');
  const [isApprove, setIsApprove] = React.useState(false);
  const [openedCard, setOpenedCards] = React.useState([]);
  const [isLoadingOpen, setIsLoadingOpen] = React.useState(false);
  const [listOpenedChestHistory, setListOpenedChestHistory] = React.useState([]);
  const [pagesQuantity, setPagesQuantity] = React.useState(1);
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1, pageSize: 5 }
  });

  const { user } = useSelector((state) => state.user);

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const { account } = useEthers();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const fwarCharDelegate = new ethers.Contract(
    FwarCharDelegate.networks[97].address,
    FwarCharDelegate.abi,
    signer
  );
  const fwarKey = new ethers.Contract(FwarKey.networks[97].address, FwarKey.abi, signer);
  const FWK = new ethers.Contract(
    FwarKeyContract.networks[97].address,
    FwarKeyContract.abi,
    signer
  );
  const allMyKey = useAllMyKey(FWK);

  React.useEffect(() => {
    if (account && user) {
      init();
    }
    return () => setIsApprove();
    // console.log(FwarCharDelegate);
  }, [account, openedCard, user, currentPage]);

  const init = async () => {
    const allowance = await fwarKey.allowance(account, fwarCharDelegate.address);
    console.log('allowance', allowance);
    if (allowance > 0) setIsApprove(true);

    const { data } = await OpenChestHistoryApi.getAll(user._id, currentPage);
    setListOpenedChestHistory(data.docs);
    setPagesQuantity(data.totalPages);
    console.log('data', data);
  };

  const handleOpenChest = async (amount) => {
    let gaslimitOpenItem = 0;
    if (amount < 1 || amount > 10) {
      toast.error('enter key 1 to 10');
    } else {
      try {
        gaslimitOpenItem = await fwarCharDelegate.estimateGas.OpenItems(account, amount);
        console.log('gaslimitOpenItem', gaslimitOpenItem);
      } catch (error) {
        if (error.data) {
          toast.error(error.data.message);
        } else {
          toast.error(error.message);
        }
        return;
      }

      // if (account && teamList) {
      if (account) {
        try {
          setIsLoadingOpen(true);

          const transactionOptions = {
            gasLimit: ethers.utils.hexlify(Number(gaslimitOpenItem) + 3000)
          };

          const tx = await fwarCharDelegate.OpenItems(account, amount, transactionOptions);
          const resultWaitTransaction = await tx.wait();
          console.log('resultWaitTransaction', resultWaitTransaction);
          const eventOpenChest = resultWaitTransaction.events.filter(
            (e) => e.event && e.event === 'OpenChest'
          );

          // infoChar = [nftId, rarity, elementType, teamId]
          const openChestInfos = eventOpenChest.map((nft) => nft.args._openChestInfo);
          const transformInfoChar = openChestInfos[0].map((cardInfo) => ({
            nftId: Number(cardInfo[0]),
            rarity: Number(cardInfo[1]),
            element: Number(cardInfo[2]),
            teamId: Number(cardInfo[3])
          }));
          console.log('eventOpenChest', eventOpenChest);
          console.log('openChestInfos', openChestInfos);
          console.log('transformInfoChar', transformInfoChar);
          setOpenedCards(transformInfoChar);
          setIsLoadingOpen(false);
          // console.log('eventMintNDT', eventMintNDT);
          toast.success('open  successfully!');
        } catch (error) {
          // console.log(error);
          if (error.data) {
            toast.error(error.data.message);
          } else {
            toast.error(error.message);
          }
          setIsLoadingOpen(false);
        }
      }
    }
  };
  // console.log('openedCard', openedCard);
  const handleApprove = async () => {
    setIsLoadingOpen(true);
    const result = await fwarKey.approve(
      fwarCharDelegate.address,
      ethers.BigNumber.from(1e6).pow(3).mul(1000000)
    );
    const tx = await result.wait();
    console.log('tx approve', tx);
    setIsApprove(true);
    setIsLoadingOpen(false);
  };
  const handleReturn = async () => {
    setOpenedCards([]);
    setAmount('');
  };
  const listOpenedChest = listOpenedChestHistory?.map((item, index) => (
    <Tr key={item._id}>
      {/* <Td>{item.createdAt}</Td> */}
      <Td w="25%" textAlign="center">
        {moment(item.createdAt).format('DD/MM/YYYY HH:MM:ss')}
      </Td>
      <Td w="15%" textAlign="center">
        {item.amount}
      </Td>
      <Td w="45%">
        <Grid templateColumns="repeat(10 , 1fr)">
          {item.nfts.map((c) => (
            <Link to={`/market-place/detail/${c.tokenId}`} key={c.tokenId}>
              <DisplayOpenedCards info={c} text={false} />
            </Link>
          ))}
        </Grid>
      </Td>
      <Td textAlign="center">
        <Link
          to={{ pathname: `https://testnet.bscscan.com/tx/${item.transactionHash}` }}
          target="_blank"
        >
          <Icon as={FiEye} />
        </Link>
      </Td>
    </Tr>
  ));

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
      <Box
        bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
        marginBottom="26px"
        borderRadius="md"
        boxShadow={theme.shadows.content}
      >
        {/* <Header /> */}
      </Box>
      <Box marginBottom="26px" position="relative">
        <Image src="/assets/chest-bg.png" top="0" h="100%" w="100%" />
        <Image src="/assets/chest.png" position="absolute" width="52%" top="3px" left="25%" />

        {isLoadingOpen && (
          <Stack
            direction="row"
            justify="center"
            align="center"
            position="absolute"
            top="0"
            w="100%"
            h="100%"
            zIndex="20"
            bg={theme.colors.primary.light}
          >
            <Spinner
              thickness="5px"
              speed="0.65s"
              emptyColor={theme.colors.primary.base}
              color="blue.500"
              size="xl"
            />
          </Stack>
        )}
        <Box
          w="100%"
          h="100%"
          p={10}
          // position="absolute"
          // top="0"
          // left="0"
          zIndex="10"
          bg={theme.colors.primary.light}
          // overflow="hidden"
        >
          {openedCard.length > 0 && (
            <Grid templateColumns="repeat(5 , 1fr)" gap={1} w="100%" h="100%">
              {openedCard.map((cardInfo) => (
                <Box key={cardInfo.nftIf}>
                  <DisplayOpenedCards info={cardInfo} />
                </Box>
              ))}
            </Grid>
          )}
        </Box>
        <Box
          position="absolute"
          w="100%"
          top="5%"
          textAlign="center"
          color="white"
          fontSize="1.5rem"
          fontWeight="bold"
        >
          {Intl.NumberFormat().format(allMyKey)} Key
        </Box>
        <Stack
          direction="column"
          justify="center"
          align="center"
          position="absolute"
          w="100%"
          bottom="2%"
          left="0"
          zIndex="100"
        >
          {!isLoadingOpen && (
            <>
              {isApprove && (
                <InputGroup
                  width="14%"
                  bg="white"
                  borderRadius="1rem"
                  color={theme.colors.dark.light}
                >
                  <InputLeftElement pointerEvents="none" children={<FiKey color="gray.300" />} />
                  <Input
                    type="number"
                    placeholder="0"
                    textAlign="center"
                    _placeholder={{ color: theme.colors.dark.light }}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <InputRightElement pointerEvents="none" children="Key" />
                </InputGroup>
              )}
              <Button
                leftIcon={<FiUnlock />}
                size="sm"
                color={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                bg={theme.colors.primary.base}
                onClick={() => {
                  isApprove ? handleOpenChest(amount) : handleApprove();
                }}
              >
                {isApprove ? `Unlock` : `Approve`}
              </Button>
            </>
          )}
        </Stack>
      </Box>
      <Box>
        <Box overflowY="scroll">
          <Table variant="simple">
            {/* <TableCaption>Paginate</TableCaption> */}
            <Thead bgColor="gray.100">
              <Tr>
                <Th textAlign="center">TIME</Th>
                {/* <Th>TYPE</Th> */}
                <Th textAlign="center">AMOUNT</Th>
                <Th>NFTS</Th>
                <Th textAlign="center">TX</Th>
              </Tr>
            </Thead>
            <Tbody>{listOpenedChest}</Tbody>
          </Table>
        </Box>
        <Box>
          <Paginator
            pagesQuantity={pagesQuantity}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            activeStyles={activeStyles}
            // normalStyles={normalStyles}
            outerLimit={3}
            innerLimit={3}
          >
            <Container align="center" justify="center" w="full" p={4}>
              <Previous mx={4}>
                Previous
                {/* Or an icon from `react-icons` */}
              </Previous>
              <PageGroup isInline align="center" />
              <Next mx={4}>
                Next
                {/* Or an icon from `react-icons` */}
              </Next>
            </Container>
          </Paginator>
        </Box>
      </Box>
    </>
  );
};
export default ChestInit;
