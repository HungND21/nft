import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorMode,
  useTheme,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image
} from '@chakra-ui/react';
import { dataRankPlayer } from './dataRankPlayer';

function Notification() {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    setData(dataRankPlayer);
  }, []);

  const listRankPlayer = data?.map((item, index) => (
    <Tr key={item.id}>
      <Td>{index + 1}</Td>
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
        <Text as="span">{item.score}</Text>
      </Td>
    </Tr>
  ));
  return (
    <>
      <Tabs variant="unstyled">
        <TabList display="flex" justifyContent="center" mb={6}>
          <Tab _selected={{ color: 'white', bg: 'primary.base' }} borderRadius="6px">
            Notification
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'primary.base' }} borderRadius="6px">
            Reward List
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text mb={2} fontSize={23} fontWeight="medium">
                  Newbie Combat
                </Text>
                <Box
                  bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  p={4}
                >
                  <Text> Daily Ranking Rewards</Text>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text mb={2} fontSize={23} fontWeight="medium">
                  PVE Combat
                </Text>
                <Box
                  bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  p={4}
                >
                  <Text> Daily Ranking Rewards</Text>
                </Box>
              </GridItem>
            </Grid>
          </TabPanel>

          <TabPanel p="0">
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 2, md: 1 }} overflow="hidden">
                <Text mb={2} fontSize={23} fontWeight="medium">
                  Weekly Rewards
                </Text>
                <Box
                  bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  p={4}
                  overflowY="scroll"
                >
                  <Table variant="simple">
                    {/* <TableCaption>Paginate</TableCaption> */}
                    <Thead bgColor="gray.100">
                      <Tr>
                        <Th>Ranking</Th>
                        <Th>Player</Th>
                        <Th>Attack</Th>
                        <Th>score</Th>
                      </Tr>
                    </Thead>
                    <Tbody>{data && listRankPlayer}</Tbody>
                  </Table>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 1 }} overflow="hidden">
                <Text mb={2} fontSize={23} fontWeight="medium">
                  Monthly Rewards
                </Text>
                <Box
                  bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
                  boxShadow="content"
                  p={4}
                  overflowY="scroll"
                >
                  <Table variant="simple">
                    {/* <TableCaption>Paginate</TableCaption> */}
                    <Thead bgColor="gray.100">
                      <Tr>
                        <Th>Ranking</Th>
                        <Th>Player</Th>
                        <Th>Attack</Th>
                        <Th>score</Th>
                      </Tr>
                    </Thead>
                    <Tbody>{data && listRankPlayer}</Tbody>
                  </Table>
                </Box>
              </GridItem>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Notification;
