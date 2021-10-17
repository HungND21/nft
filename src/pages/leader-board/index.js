import {
  Box,
  Image,
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
  useTheme,
  ScaleFade,
  Tooltip
} from '@chakra-ui/react';
import React from 'react';
import RankPlayerImage from './RankPlayerImage';
import { useSelector } from 'react-redux';
import RankApi from 'apis/RankApi';

function LeaderBoard() {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { user } = useSelector((state) => state.user);
  const [listUsersRank, setListUsersRank] = React.useState([]); // list user
  const getRanks = async () => {
    if (user) {
      const { data: listUsers } = await RankApi.getAllRanks();
      setListUsersRank(listUsers.docs);
      console.log('listUsers', listUsers.docs);
      // setPagesQuantity(listCard.totalPages);
    }
  };

  React.useEffect(() => {
    getRanks();
  }, [user]);
  const rankPlayerTop3 = listUsersRank?.slice(0, 3);

  const listRankPlayer = listUsersRank?.map((item, index) => (
    <Tr key={item.id}>
      <Td>{index + 1}</Td>
      <Td>
        <Image src={item.imageRegion} w="84px" />
      </Td>

      <Td>
      <Tooltip label={item.userId.address} aria-label="A tooltip">
        <Text>
        {item.userId.address.substr(1, 4)}...
        {item.userId.address.substr(item.userId.address.length - 4, 4)}
        </Text>
      </Tooltip>
       </Td>
      <Td>
        <Text>{item.win}</Text>
      </Td>
      <Td>
        <Text>{item.lose}</Text>
      </Td>
      <Td>
        <Text>{item.score}</Text>
      </Td>
    </Tr>
  ));

  return (
    <>
      <ScaleFade initialScale={1.15} in>
              {rankPlayerTop3.length && <RankPlayerImage data={rankPlayerTop3} />}
              <Box p={5}>
                <Box overflowY="scroll">
                  <Table variant="simple">
                    {/* <TableCaption>Paginate</TableCaption> */}
                    <Thead bgColor="gray.100">
                      <Tr>
                        <Th>Ranking</Th>
                        <Th>region</Th>
                        <Th>Player</Th>
                        <Th>Win</Th>
                        <Th>Lose</Th>
                        <Th>Score</Th>
                      </Tr>
                    </Thead>
                    <Tbody>{listRankPlayer}</Tbody>
                  </Table>
                </Box>
              </Box>
      </ScaleFade>
    </>
  );
}

export default LeaderBoard;
