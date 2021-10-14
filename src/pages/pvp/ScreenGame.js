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
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isJoin, setIsJoin] = React.useState(false);

  const [find, setFind] = React.useState(false);
  function Start() {
    // setFind(true);
    setIsJoin(true);
    console.log('user._id', user);
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
          console.log('1');
          setIsLoaded(true);
          console.log('2');
          Start();
          console.log('3');
        });
      }
    },
    [user]
  );
  // React.useEffect(function () {
  //   unityContext.on('canvas', function (canvas) {
  //     canvas.getContext('webgl');
  //   });
  // }, []);
  // Start()
  return (
    <>
      <Box pos="relative" my={10} pb={10} h="800px">
        <button onClick={() => setFind(true)}>start</button>
        {/* {!find && <Image src="/assets/bg-game.png" />} */}
        {/* <input type="text" autofocus="true" /> */}
        {!find && <Image src="/assets/bg-game.png" />}
        <Box
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -62%)"
          cursor="pointer"
          onClick={() => Start()}

          // onFocus=
        >
          <Box w="100%" h="100%">
            {find && (
              <Unity
                unityContext={unityContext}
                style={{
                  height: '100%',
                  width: 900,
                  border: '2px solid black',
                  background: 'grey',
                  visibility: isLoaded ? 'visible' : 'hidden'
                }}
              />
            )}
          </Box>
          {/* {find ? (
          ) : (
          )} */}
          <Image
            src="/assets/icon-submit.png"
            // pos="absolute"
            // top="0"
            style={{
              visibility: find ? 'hidden' : 'visible'
            }}
          />
        </Box>
      </Box>
    </>
  );
}

export default ScreenGame;
