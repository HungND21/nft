import { 
    Box, 
    Image, 
    Text, 
    ViewIcon, 
    Tooltip,
    Table,
    TableCaption,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Tfoot, 
    Icon,
    Grid,
    Link } from '@chakra-ui/react';
import React from 'react';
import moment from 'moment';
import TransactionCard from 'components/DisplayCard';
import { FiEye} from 'react-icons/fi';
import { BACKEND_URL_LOCAL, BACKEND_URL_HOSTING, BSCTESTNET_TRANSACTION_URL } from 'utils/config';

function TransactionDisplay({ transaction}) {
  return (
    <>
      <Tr>
      <Td w="20%">{moment(transaction.createdAt).format('DD/MM/YYYY HH:MM:ss')}</Td>
      <Td w="20%">
        <Tooltip label={transaction.from} aria-label="A tooltip">
          <Text>{transaction.from.substr(1,4)}...{transaction.from.substr(transaction.from.length-4,4)}</Text>
        </Tooltip>
      </Td>
      <Td w="20%">
        <Tooltip label={transaction.owner} aria-label="A tooltip">
          <Text>{transaction.owner.substr(1,4)}...{transaction.owner.substr(transaction.owner.length-4,4)}</Text>
        </Tooltip>
      </Td>
      <Td>{transaction.price}</Td>
      <Td>
        <Grid templateColumns="repeat(4 , 1fr)">
          {transaction.nfts.map((c) => (
            <Link href={`/market-place/detail/${c.nftId}`} key= {c.nftId} >
              <TransactionCard info={c} text={false} />
            </Link>
          ))}
        </Grid>
      </Td>
      <Td>
        <Link href={`${BSCTESTNET_TRANSACTION_URL+transaction.tx}`} isExternal>
            <Icon color="primary.base" as={FiEye} />
        </Link>
      </Td>
    </Tr>

    </>
  );
}

export default TransactionDisplay;
