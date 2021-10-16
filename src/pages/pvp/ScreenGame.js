import React from 'react';
import { Box, Grid, Image, Stack, useColorMode, useTheme, VStack, Button } from '@chakra-ui/react';
import Unity, { UnityContext } from 'react-unity-webgl';
import { useSelector } from 'react-redux';
import { useEthers } from '@usedapp/core';

const buildUrl = 'Build';
const loaderUrl = buildUrl + '/8031bb89cbdcee2a35fdb30bf72a5641.js';
const config = {
  dataUrl: buildUrl + '/f60b7fcf0663d5071c5e56b8572ded02.data',
  frameworkUrl: buildUrl + '/cab6beec8dfc11ce73770d89de0ff733.js',
  codeUrl: buildUrl + '/401d05ef5c557ce291f264e4c86dc5a1.wasm',
  streamingAssetsUrl: 'StreamingAssets',
  companyName: 'Fusion',
  productName: 'Fwar',
  productVersion: '1.1',
};

const unityContext = new UnityContext({
  loaderUrl,
  ...config,
  webGLContextAttributes: {
    preserveDrawingBuffer: true,
  },
});
function ScreenGame() {
  const { account } = useEthers();
  const { user } = useSelector((state) => state.user);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isJoin, setIsJoin] = React.useState(false);

  const [find, setFind] = React.useState(false);
  function Start() {
    // setFind(true);
    setIsJoin(true);

    // console.log('user._id', user);
    unityContext.send('GameManager', 'SetNumberOfLane', 1);
    unityContext.send('GameManager', 'SetPlayerId', user._id);
    // unityContext.send('GameManager', 'SetRole', 'attacker');
    // unityContext.send('GameManager', 'StartGame');
    // setStart(true);

    // console.log(attacker, roomId);
  }
  // function handleOnClickFullscreen() {
  //   unityContext.setFullscreen(true);
  // }
  React.useEffect(
    function () {
      if (user) {
        unityContext.on('loaded', function () {
          setIsLoaded(true);
          setIsJoin(true);
        });
      }
    },
    [user]
  );
  function handleOnClickFullscreen() {
    unityContext.setFullscreen(true);
  }
  return (
    <>
      <Box pos="relative" my={10} overflow="hidden">
        <Button onClick={handleOnClickFullscreen}>Fullscreen</Button>
        {!isJoin && <Image src="/assets/bg-game.png" w="100%" />}
        <Box onClick={() => Start()} zIndex="docked" bgImage="src('/assets/bg-game.png')">
          <Box w="100%" h="100%">
            {/* {isJoin && ( */}
            <Unity
              unityContext={unityContext}
              style={{
                height: '100%',
                width: '100%',
                border: '2px solid black',
                background: 'grey',
                visibility: isLoaded ? 'visible' : 'hidden'
              }}
            />
            {/* )} */}
          </Box>
        </Box>
        <Image
          src="/assets/icon-join.png"
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="dropdown"
          visibility={isJoin ? 'hidden' : 'visible'}
          cursor="pointer"
          onClick={() => {
            setFind(true);
            Start();
          }}
        />
      </Box>
    </>
  );
}

export default ScreenGame;
