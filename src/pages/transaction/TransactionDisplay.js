import {
  Box,
  Text,
  Tooltip,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Icon,
  Grid,
  Link
} from '@chakra-ui/react';
import React from 'react';
import moment from 'moment';
import TransactionCard from 'components/DisplayCard';
import { FiEye } from 'react-icons/fi';
import { BSCTESTNET_TRANSACTION_URL } from 'utils/config';
import PaginatorCustom from 'components/PaginatorCustom';
import { usePaginator } from 'chakra-paginator';

function TransactionDisplay({ listTransaction, pagesQuantity, getTransaction }) {
  // console.log('listTransactions', listTransaction);
  const { currentPage, setCurrentPage } = usePaginator({
    initialState: { currentPage: 1, pageSize: 5 }
  });
  React.useEffect(() => {
    getTransaction(currentPage);
  }, [currentPage]);
  return (
    <>
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
          {listTransaction &&
            listTransaction.length > 0 &&
            listTransaction.map((transaction) => (
              <Tr key={transaction.tx}>
                <Td w="20%">{moment(transaction.createdAt).format('DD/MM/YYYY HH:MM:ss')}</Td>
                <Td w="20%">
                  <Tooltip label={transaction.from} aria-label="A tooltip">
                    <Text>
                      {transaction.from.substr(1, 4)}...
                      {transaction.from.substr(transaction.from.length - 4, 4)}
                    </Text>
                  </Tooltip>
                </Td>
                <Td w="20%">
                  <Tooltip label={transaction.owner} aria-label="A tooltip">
                    <Text>
                      {transaction.owner.substr(1, 4)}...
                      {transaction.owner.substr(transaction.owner.length - 4, 4)}
                    </Text>
                  </Tooltip>
                </Td>
                <Td>{transaction.price}</Td>
                <Td>
                  <Grid templateColumns="repeat(4 , 1fr)">
                    {transaction.nfts.map((c) => (
                      <Link href={`/market-place/detail/${c.nftId}`} key={c.nftId}>
                        <TransactionCard info={c} text={false} />
                      </Link>
                    ))}
                  </Grid>
                </Td>
                <Td>
                  <Link href={`${BSCTESTNET_TRANSACTION_URL + transaction.tx}`} isExternal>
                    <Icon color="primary.base" as={FiEye} />
                  </Link>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      <Box my={5}>
        <PaginatorCustom
          pagesQuantity={pagesQuantity > 0 && pagesQuantity}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Box>
    </>
  );
}

export default TransactionDisplay;
