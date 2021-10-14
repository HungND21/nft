import React from 'react';
import { Box, Grid, Image, Stack, useColorMode, useTheme, VStack, Button } from '@chakra-ui/react';
import Unity, { UnityContext } from 'react-unity-webgl';
import { useSelector } from 'react-redux';
import { useEthers } from '@usedapp/core';

const unityContext = new UnityContext({
  loaderUrl: 'Build/phxmhxxn.github.io.loader.js',
  dataUrl: 'Build/phxmhxxn.github.io.data',
  frameworkUrl: 'Build/phxmhxxn.github.io.framework.js',
  codeUrl: 'Build/phxmhxxn.github.io.wasm',
  webGLContextAttributes: {
    preserveDrawingBuffer: true
  }
});

function ScreenGame() {
  const { account } = useEthers();
  const { user } = useSelector((state) => state.user);

  const [find, setFind] = React.useState(false);
  function spawnEnemies() {
    setFind(true);
    unityContext.send('GameManager', 'SetNumberOfLane', '3');
    unityContext.send('GameManager', 'SetPlayerId', user._id);
    unityContext.send('GameManager', 'SetRole', true);
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
        {!find && <Image src="/assets/bg-game.png" />}
        <Box
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -62%)"
          cursor="pointer"
          onClick={() => spawnEnemies()}
        >
          {find ? (
            <Box w="100%" h="100%">
              <Unity
                unityContext={unityContext}
                style={{
                  height: '100%',
                  width: 1350,
                  border: '2px solid black',
                  background: 'grey'
                }}
              />
            </Box>
          ) : (
            <Image src="/assets/icon-submit.png" />
          )}
        </Box>
      </Box>
    </>
  );
}

export default ScreenGame;
