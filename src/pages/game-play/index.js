import React, { useEffect, useState } from 'react';
import { useColorMode, Button, Input, RadioGroup, Stack, Radio, Box } from '@chakra-ui/react';

import { useWeb3React } from '@web3-react/core';
import Unity, { UnityContext } from 'react-unity-webgl';

const unityContext = new UnityContext({
  loaderUrl: 'Build/F-W.loader.js',
  dataUrl: 'Build/F-W.data',
  frameworkUrl: 'Build/F-W.framework.js',
  codeUrl: 'Build/F-W.wasm',
  webGLContextAttributes: {
    preserveDrawingBuffer: true
  }
});

const Farm = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [roomId, setRoomId] = useState('');
  const [attacker, setAttacker] = useState('attacker');
  const [start, setStart] = React.useState(false);
  useEffect(function () {
    unityContext.on('canvas', function (canvas) {
      canvas.width = '1920';
      canvas.height = '1080';
      // canvas.style('transform: scale(0.4)');

      // ctx.scale(0.5);
    });
  }, []);
  function spawnEnemies() {
    unityContext.send('GameManager', 'chooseRole', attacker);
    unityContext.send('GameManager', 'RoomId', roomId);
    unityContext.send('GameManager', 'StartGame');
    setStart(true);
    // console.log(attacker, roomId);
  }
  return (
    <>
      {!start && (
        <>
          <Input placeholder="so phong" size="md" onChange={(e) => setRoomId(e.target.value)} />
          <RadioGroup value={attacker} onChange={setAttacker}>
            <Stack direction="row">
              <Radio value="attacker" colorScheme="orange">
                attacker
              </Radio>
              <Radio value="defender" colorScheme="orange">
                defender
              </Radio>
            </Stack>
          </RadioGroup>
          <Button onClick={spawnEnemies}>start</Button>
        </>
      )}
      <Box w="100%" h="80vh">
        <Unity
          unityContext={unityContext}
          // style={{ transformOrigin: '0', transform: 'scale(0.8)' }}
        />
      </Box>
    </>
  );
};
export default Farm;
