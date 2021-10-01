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
  useTheme
} from '@chakra-ui/react';
import React from 'react';
import RankPlayerImage from './RankPlayerImage';
import { dataRankPlayer } from './dataRankPlayer';
function LeaderBoard() {
  const [data, setData] = React.useState([]);
  const theme = useTheme();
  const { colorMode } = useColorMode();
  React.useEffect(() => {
    setData(dataRankPlayer);
  }, []);
  const rankPlayerTop3 = data?.slice(0, 3);

  const listRankPlayer = data?.map((item, index) => (
    <Tr key={item.id}>
      <Td>{index + 1}</Td>
      <Td>
        <Image src={item.imageRegion} w="84px" />
      </Td>
      <Td>{item.name}</Td>
      <Td>
        <Box display="flex">
          {/* image item */}
          <Box w="3rem" position="relative">
            <Image src="https://zoogame.app/nfts/bg/5/bg.png" w="100%" />
            <Image src={item.imageItem} w="90%" position="absolute" top="20%" left="5%" />
            <Image
              src="https://zoogame.app/nfts/bg/5/border.png"
              w="100%"
              position="absolute"
              top="0"
            />
          </Box>
          <Box w="3rem" position="relative">
            <Image src="https://zoogame.app/nfts/bg/5/bg.png" w="100%" />
            <Image
              src="https://zoogame.app/nfts/normal/20.png"
              w="90%"
              position="absolute"
              top="20%"
              left="5%"
            />
            <Image
              src="https://zoogame.app/nfts/bg/5/border.png"
              w="100%"
              position="absolute"
              top="0"
            />
          </Box>
          <Box w="3rem" position="relative">
            <Image src="https://zoogame.app/nfts/bg/5/bg.png" w="100%" />
            <Image
              src="https://zoogame.app/nfts/normal/20.png"
              w="90%"
              position="absolute"
              top="20%"
              left="5%"
            />
            <Image
              src="https://zoogame.app/nfts/bg/5/border.png"
              w="100%"
              position="absolute"
              top="0"
            />
          </Box>
        </Box>
      </Td>
      <Td>
        <Text as="span">
          <Image src="https://zoogame.app/chest/airdrop.png" w="20px" display="inline" />
          {item.hashPower}
        </Text>
      </Td>
    </Tr>
  ));

  return (
    <>
      <Tabs variant="unstyled">
        <TabList display="flex" justifyContent="center" mb={6}>
          <Tab _selected={{ color: 'white', bg: 'primary.base' }} borderRadius="6px">
            Player Hash Power
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'primary.base' }} borderRadius="6px">
            NFTs Hash Power
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
            boxShadow="content"
            p="0"
          >
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
                      <Th>strongest hero</Th>
                      <Th>Hash Power</Th>
                    </Tr>
                  </Thead>
                  <Tbody>{data && listRankPlayer}</Tbody>
                </Table>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel
            bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
            boxShadow="content"
          >
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default LeaderBoard;
