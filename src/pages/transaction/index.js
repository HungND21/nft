import React from 'react';
import { useEthers } from '@usedapp/core';
import {
  Box,
  Stack,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useTheme,
  useColorMode,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Image,
  Icon,
  ScaleFade,
  Tooltip,
  Text
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { Container, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator';
import TransactionApi from 'apis/TransactionApi';
import TransactionRow from './TransactionDisplay';
import PaginatorCustom from 'components/PaginatorCustom'

function Transaction() {
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const { account } = useEthers();
  const { user } = useSelector((state) => state.user);
  const [listmyTransaction, SetListMyTransaction] = React.useState([])
  const [listAllTransaction, SetListAllTransaction] = React.useState([])
  const { currentPageMine, setCurrentPageMine } = usePaginator({
    initialState: { currentPage: 1, pageSize: 5 }
  });
  const { currentPageAll, setCurrentPageAll } = usePaginator({
    initialState: { currentPage: 1, pageSize: 5 }
  });
  const [pagesQuantityMine, setMinePagesQuantity] = React.useState(1);
  const [pagesQuantityAll, setAllPagesQuantity] = React.useState(1);

  const getMyTransaction = async () => {
    if (user) {
      console.log(user._id);
      const { data: listTrans } = await TransactionApi.getMyTrans({
        userId: user.address,
        page: currentPageMine,
      });
      SetListMyTransaction(listTrans.docs);
      console.log('listTrans', listTrans.docs);
      setMinePagesQuantity(listTrans.totalPages);
    }
  };

  const getAllTransaction = async () => {
      const { data: listTrans } = await TransactionApi.getAllTrans({
        page: currentPageAll,
      });
      SetListAllTransaction(listTrans.docs);
      console.log('allTrans', listTrans.docs);
      setAllPagesQuantity(listTrans.totalPages);
  };

  React.useEffect(() => {
    document.title = 'FWAR - TRANSACTIONS';
    if (account) {
      getMyTransaction();
    }
    getAllTransaction();
  }, [account, currentPageMine, currentPageAll, user]);

  return (
        <Tabs variant="unstyled">
          <TabList display="flex" justifyContent="center" mb={6}>
            <Tab _selected={{ color: 'white', bg: 'primary.base' }} borderRadius="6px">
              Mine
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'primary.base' }} borderRadius="6px">
              All
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel
              bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
              boxShadow="content"
            >
              <Table variant="simple">
                <Thead bgColor="gray.200">
                  <Tr>
                    <Th>createdAt</Th>
                    <Th>from</Th>
                    <Th>owner</Th>
                    <Th>price</Th>
                    <Th>nfts</Th>
                    <Th>tx</Th>
                  </Tr>
                </Thead>
                <Tbody >
                {listmyTransaction.map((c) => (
                    <TransactionRow key ={c._id} transaction={c}/>
                ))}
                </Tbody>
              </Table>
              <Box my={5}>
                <PaginatorCustom
                  pagesQuantity={pagesQuantityMine > 0 && pagesQuantityMine}
                  currentPage={currentPageMine}
                  setCurrentPage={setCurrentPageMine}
                />
              </Box>
            </TabPanel>
            <TabPanel
              bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
              boxShadow="content"
            >
              <Table variant="simple">
                <Thead bgColor="gray.200">
                  <Tr>
                    <Th>createdAt</Th>
                    <Th>from</Th>
                    <Th>owner</Th>
                    <Th>price</Th>
                    <Th>nfts</Th>
                    <Th>tx</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {listAllTransaction.map((c) => (
                      <TransactionRow key ={c._id} transaction={c}/>
                  ))}
                </Tbody>
              </Table>
              <Box my={5}>
                <PaginatorCustom
                  pagesQuantity={pagesQuantityAll > 0 && pagesQuantityAll}
                  currentPage={currentPageAll}
                  setCurrentPage={setCurrentPageAll}
                />
              </Box>
            </TabPanel>
          </TabPanels> 
        </Tabs>
  );
}

export default Transaction;
