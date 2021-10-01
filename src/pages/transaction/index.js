import React from 'react';
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
  Icon
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
function Transaction() {
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
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
    </>
  );
}

export default Transaction;
