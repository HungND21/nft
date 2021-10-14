import { Box, Grid, Image, Stack, useColorMode, useTheme, VStack, Button } from '@chakra-ui/react';
import Loadable from 'components/Loadable';
import ScaleFadeCustom from 'components/ScaleFadeCustom';
import React, { lazy } from 'react';
import { useSelector } from 'react-redux';

// import ChooseTeamComponent from './ChooseTeamComponent';
import Header from './Header';
import ScreenGame from './ScreenGame';
const ChooseTeamComponent = Loadable(lazy(() => import('./ChooseTeamComponent')));

function Pvp() {
  const { user } = useSelector((state) => state.user);

  const theme = useTheme();
  const { colorMode } = useColorMode();
  // console.log('colyseus', Colyseus);
  // console.log(user);

  return (
    <>
      <ScaleFadeCustom>
        <Header />
        {/* <Button onClick={joinRoom}>join room</Button> */}
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

        <ScreenGame />
      </ScaleFadeCustom>
    </>
  );
}

export default Pvp;
