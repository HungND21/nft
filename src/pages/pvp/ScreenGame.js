import React from 'react';
import { Box, Grid, Image, Stack, useColorMode, useTheme, VStack, Button } from '@chakra-ui/react';
import Unity, { UnityContext } from 'react-unity-webgl';
import { useSelector } from 'react-redux';
import { useEthers } from '@usedapp/core';

const unityContext = new UnityContext({
  loaderUrl: 'Build/Build.loader.js',
  dataUrl: 'Build/Build.data',
  frameworkUrl: 'Build/Build.framework.js',
  codeUrl: 'Build/Build.wasm',
  webGLContextAttributes: {
    preserveDrawingBuffer: true
  }
});

function ScreenGame() {
  const { account } = useEthers();
  const { user } = useSelector((state) => state.user);

  const [find, setFind] = React.useState(false);
  function spawnEnemies() {
    // setFind(true);
    console.log('user._id', user);

    unityContext.send('GameManager', 'SetNumberOfLane', 1);
    unityContext.send('GameManager', 'SetPlayerId', user._id);
    unityContext.send('GameManager', 'SetRole', 'attacker');
    unityContext.send('GameManager', 'StartGame');
    // setStart(true);
    // console.log(attacker, roomId);
  }
  function handleOnClickFullscreen() {
    unityContext.setFullscreen(true);
  }
  return (
    <>
      <Box pos="relative" my={10} pb={10} h="800px">
        <button onClick={() => spawnEnemies()}>start</button>
        {!find && <Image src="/assets/bg-game.png" />}
        <Box
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -62%)"
          cursor="pointer"
          onClick={() => spawnEnemies()}
        >
          <Box w="100%" h="100%">
            <Unity
              unityContext={unityContext}
              style={{
                height: '100%',
                width: 900,
                border: '2px solid black',
                background: 'grey'
              }}
            />
          </Box>
          {/* {find ? (
          ) : (
            <Image src="/assets/icon-submit.png" />
          )} */}
        </Box>
      </Box>
    </>
  );
}

export default ScreenGame;
