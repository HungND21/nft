import { Box, Text, useColorMode, useTheme, Stack, RadioGroup, Radio } from '@chakra-ui/react';
import React from 'react';

const dataRarity = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Junk' },
  { id: '3', name: 'Normal' },
  { id: '4', name: 'Rare' },
  { id: '5', name: 'Epic' },
  { id: '6', name: 'Legendary' }
];
const dataTeaming = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Pelicans' },
  { id: '3', name: 'DogeArmy' },
  { id: '4', name: 'Nuggets' },
  { id: '5', name: 'Chow Chow' },
  { id: '6', name: 'Bobcats' },
  { id: '7', name: 'Uni' },
  { id: '8', name: 'The Cat & The Mouse' },
  { id: '9', name: 'Hyena' },
  { id: '10', name: 'King' },
  { id: '11', name: 'Kung Fu Bunny' },
  { id: '12', name: 'Monkey' },
  { id: '13', name: 'Alligator' },
  { id: '14', name: 'King Kong' },
  { id: '15', name: 'ShibaArmy' },
  { id: '16', name: 'Doggy' },
  { id: '17', name: 'Giraffe' },
  { id: '18', name: 'Heavy Weight' },
  { id: '19', name: 'C&D' },
  { id: '20', name: 'Akita' },
  { id: '21', name: 'Bulls' },
  { id: '22', name: 'Ice Age' },
  { id: '23', name: 'Wakanda' },
  { id: '24', name: 'Wakawaka' },
  { id: '25', name: 'Silance Alan' }
];

function Sidebar() {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const [valueRarity, setValueRarity] = React.useState('1');
  const [valueTeaming, setValueTeaming] = React.useState('1');
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
          <RadioGroup onChange={setValueRarity} value={valueRarity}>
            <Stack>
              {dataRarity.map((item) => (
                <Radio key={item.id} value={item.id}>
                  {item.name}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>

          <Text marginTop={10} marginBottom={3}>
            Teaming
          </Text>
          <RadioGroup onChange={setValueTeaming} value={valueTeaming}>
            <Stack>
              {dataTeaming.map((item) => (
                <Radio key={item.id} value={item.id}>
                  {item.name}
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
