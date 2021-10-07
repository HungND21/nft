import { Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode, useTheme } from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import TransactionApi from 'apis/TransactionApi';
import { usePaginator } from 'chakra-paginator';
import React from 'react';
import { useSelector } from 'react-redux';
import TransactionDisplay from './TransactionDisplay';

function Transaction() {
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const { account } = useEthers();
  const { user } = useSelector((state) => state.user);
  const [listMyTransaction, SetListMyTransaction] = React.useState([]);
  const [listAllTransaction, SetListAllTransaction] = React.useState([]);

  const [currentPageAll, setCurrentPageAll] = React.useState(1);
  const [currentPageMine, setCurrentPageMine] = React.useState(1);

  const [pagesQuantityMine, setMinePagesQuantity] = React.useState(1);
  const [pagesQuantityAll, setAllPagesQuantity] = React.useState(1);

  const getMyTransaction = async () => {
    if (user) {
      // console.log(user._id);
      const { data: listTrans } = await TransactionApi.getMyTrans({
        userId: user.address,
        page: currentPageMine
      });
      SetListMyTransaction(listTrans.docs);
      // console.log('listTrans', listTrans.docs);
      setMinePagesQuantity(listTrans.totalPages);
    }
  };
  const setPageAll = (page) => {
    console.log('page', page);
    setCurrentPageAll(page);
  };
  const setPageMine = (page) => {
    setCurrentPageMine(page);
  };
  const getAllTransaction = async (currentPageAll) => {
    if (user) {
      const { data: listTrans } = await TransactionApi.getAllTrans({
        page: currentPageAll
      });
      SetListAllTransaction(listTrans.docs);
      setAllPagesQuantity(listTrans.totalPages);
    }
    // console.log('allTrans', listTrans.docs);
  };

  React.useEffect(() => {
    document.title = 'FWAR - TRANSACTIONS';
    if (account) {
      getMyTransaction(currentPageMine);
      getAllTransaction(currentPageAll);
    }
  }, [account, currentPageMine, user, currentPageAll]);

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
        <TabPanel bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'} boxShadow="content">
          <TransactionDisplay
            listTransaction={listMyTransaction}
            getTransaction={setPageMine}
            pagesQuantity={pagesQuantityMine}
          />
        </TabPanel>
        <TabPanel bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'} boxShadow="content">
          <TransactionDisplay
            listTransaction={listAllTransaction}
            getTransaction={setPageAll}
            pagesQuantity={pagesQuantityAll}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Transaction;
