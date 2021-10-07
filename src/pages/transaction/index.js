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
  ScaleFade
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
<<<<<<< HEAD
import { useSelector } from 'react-redux';
import { Container, Next, PageGroup, Paginator, Previous, usePaginator } from 'chakra-paginator';
import OrderAPI from 'apis/OrderApi';

=======
import ScaleFadeCustom from 'components/ScaleFadeCustom';
>>>>>>> 26490e54cd6c2b9323cd78e6a4d2820b79ef10c1
function Transaction() {
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();
  const { account } = useEthers();
  const { user } = useSelector((state) => state.user);
  const [listTransaction, SetListTransaction] = React.useState({})
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1, pageSize: 5 }
  });
  const [pagesQuantity, setPagesQuantity] = React.useState(1);

  const getMyTransaction = async () => {
    if (user) {
      console.log(user._id);
      const { data: listTrans } = await OrderAPI.getMyOrder({
        userId: user._id,
        page: currentPage,
        status: 'buyed'
      });
      SetListTransaction(listTrans.docs);
      console.log('listTrans', listTrans.docs);
      setPagesQuantity(listTrans.totalPages);
    }
  };
  React.useEffect(() => {
    document.title = 'FWAR - TRANSACTIONS';
    if (account) {
      getMyTransaction();
    }
  }, [
    account,
    currentPage,
    user
  ]);
  return (
    <>
      <ScaleFadeCustom>
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
                <TableCaption>Paginate</TableCaption>
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
                  <Tr>
                    <Td>2021-09-08 04:32:46</Td>
                    <Td>0xf7...e9ab</Td>
                    <Td>0x2f...80dc</Td>
                    <Td>$ 8</Td>
                    <Td>
                      <Box w="3rem">
                        <Box w="3rem" position="relative">
                          <Image src="https://zoogame.app/nfts/bg/1/bg.png" w="100%" />
                          <Image
                            src="https://zoogame.app/nfts/normal/20.png"
                            w="90%"
                            position="absolute"
                            top="20%"
                            left="5%"
                          />
                          <Image
                            src="https://zoogame.app/nfts/bg/1/border.png"
                            w="100%"
                            position="absolute"
                            top="0"
                          />
                        </Box>
                      </Box>
                    </Td>
                    <Td>
                      <Icon color="primary.base" as={ViewIcon} />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel
              bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
              boxShadow="content"
            >
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ScaleFadeCustom>
    </>
  );
}

export default Transaction;
