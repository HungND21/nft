import { Box, Grid, Image, Stack, useColorMode, useTheme, VStack, Button } from '@chakra-ui/react';
import Loadable from 'components/Loadable';
import ScaleFadeCustom from 'components/ScaleFadeCustom';
import React, { lazy } from 'react';
import { useSelector } from 'react-redux';
import * as Colyseus from 'colyseus.js';

// import ChooseTeamComponent from './ChooseTeamComponent';
import Header from './Header';
const ChooseTeamComponent = Loadable(lazy(() => import('./ChooseTeamComponent')));

function Pvp() {
  const { user } = useSelector((state) => state.user);

  const theme = useTheme();
  const { colorMode } = useColorMode();
  console.log('colyseus', Colyseus);
  console.log(user);
  const joinRoom = async () => {
    let client = new Colyseus.Client('ws://fwar-match-maker.herokuapp.com/');

    const availableRooms = await client.getAvailableRooms('Fwar_Room');
    console.log(availableRooms);
    if (availableRooms.length === 0) {
      const newroom = await client.joinOrCreate('Fwar_Room', { userid: user._id });
      console.log(newroom);
      // SetIsWaiting(true);
    } else {
      for (var i = 0; i < availableRooms.length; i++) {
        console.log(availableRooms[i].metadata);
        if (availableRooms[i]) {
          var room = client.joinById(availableRooms[i].roomId, { userid: user._id });
          return;
        } else {
          console.log('cannot join room');
        }
      }
    }
  };
  return (
    <>
      <ScaleFadeCustom>
        <Header />
        <Button onClick={joinRoom}>join room</Button>
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={5}>
          <VStack spacing="8">
            <ChooseTeamComponent user={user} cardType="attacker" />
            <ChooseTeamComponent user={user} cardType="defender" />
          </VStack>
          <Stack
            align="center"
            justify="center"
            p={5}
            bg={colorMode === 'dark' ? theme.colors.dark.light : 'white'}
            borderRadius="8px"
          >
            <Image src="/assets/bg-nh.png" />
          </Stack>
        </Grid>

        <Box pos="relative" my={10} pb={10}>
          <Image src="/assets/bg-game.png" />
          <Box
            pos="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -62%)"
            cursor="pointer"
            onClick={() => console.log(2)}
          >
            <Image src="/assets/icon-submit.png" />
          </Box>
        </Box>
      </ScaleFadeCustom>
    </>
  );
}

export default Pvp;
