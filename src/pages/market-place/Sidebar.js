import { Box, Text, useColorMode, useTheme, Stack, RadioGroup, Radio } from '@chakra-ui/react';
import React from 'react';

function Sidebar({handleRarity, valueRarity,rarityList, handleTeam, valueTeam, teamList}) {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  return (
    <>
      <Text fontSize="0.9rem" fontWeight="medium" marginBottom="1rem">
        Filters
      </Text>
      <Box
        w="16.25rem"
        p={5}
        bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
        boxShadow="content"
        borderRadius="6px"
      >
        <Box>
          <Text marginTop={10} marginBottom={3}>
            Rarity
          </Text>
          <RadioGroup onChange={handleRarity} value={valueRarity}>
            <Stack>
              {rarityList.map((item) => (
                <Radio key={item.value} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>

          <Text marginTop={10} marginBottom={3}>
            Teaming
          </Text>
          <RadioGroup onChange={handleTeam} value={valueTeam}>
            <Stack>
              {teamList.map((item) => (
                <Radio key={item.value} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </Box>
      </Box>
    </>
  );
}

export default Sidebar;
