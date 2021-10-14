import React, { useEffect, useState } from 'react';
import { useColorMode, Button, Input, RadioGroup, Stack, Radio, Box } from '@chakra-ui/react';

// import { useWeb3React } from '@web3-react/core';
import Unity, { UnityContext } from 'react-unity-webgl';

const unityContext = new UnityContext({
  loaderUrl: 'Build/phxmhxxn.github.io.loader.js',
  dataUrl: 'Build/phxmhxxn.github.io.data',
  frameworkUrl: 'Build/phxmhxxn.github.io.framework.js',
  codeUrl: 'Build/phxmhxxn.github.io.wasm',
  webGLContextAttributes: {
    preserveDrawingBuffer: true
  }
});

const GamePlay = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  // const [roomId, setRoomId] = useState('');
  // const [attacker, setAttacker] = useState('attacker');
  const [start, setStart] = React.useState(false);
  useEffect(function () {
    unityContext.on('canvas', function (canvas) {
      canvas.width = '800';
      canvas.height = '450';
      // canvas.style('transform: scale(0.4)');
      // ctx.scale(0.5);
    });
  }, []);
  let data = [
    {
      undefined: 'PineApple',
      nameCard: 'PineappleFruit_Card',
      type: 'defender',
      hp: '18120',
      atk: '1796.9',
      def: '1208',
      level: '30',
      spd: '0',
      AttackRange: '80',
      AttackSpeed: '1',
      Cooldown: '1.04',
      CritRate: '0.03',
      CritDamage: '1.5',
      KnockBackRes: '1',
      BurnRes: '0',
      PoisonRes: '0',
      SlowRes: '0',
      StunRes: '0',
      BurnEffectDmg: '180',
      PoisonEffectDmg: '180',
      Accuracy: '1',
      Evasion: '0',
      elementType: 'metal',
      KnockBackDistance: '100',
      FireEffectRate: '1',
      WaterEffectRate: '0.3',
      WoodEffectRate: '1',
      EarthEffectRate: '0.15',
      MetalEffectRate: '0.15',
      EffectDuration: '0.9',
      ElementAdvantage: '0'
    }
  ];
  data = JSON.stringify(data);
  console.log(data);
  const playerId = 'player1';
  const roomId = '1';
  function spawnEnemies() {
    unityContext.send('GameManager', 'SetPlayerId', 'player1');
    unityContext.send('GameManager', 'SetData', data);
    unityContext.send('GameManager', 'SetRole', 'true');
    unityContext.send('GameManager', 'SetRoomId', '1');
    unityContext.send('GameManager', 'StartGame');
    // setStart(true);
    // console.log(attacker, roomId);
  }
  function handleOnClickFullscreen() {
    unityContext.setFullscreen(true);
  }
  return (
    <>
      {!start && (
        <>
          {/* <Input placeholder="so phong" size="md" onChange={(e) => setRoomId(e.target.value)} /> */}
          {/* <RadioGroup value={attacker} onChange={setAttacker}>
            <Stack direction="row">
              <Radio value="attacker" colorScheme="orange">
                attacker
              </Radio>
              <Radio value="defender" colorScheme="orange">
                defender
              </Radio>
            </Stack>
          </RadioGroup>
          <Button onClick={spawnEnemies}>start</Button> */}
        </>
      )}
      <button onClick={handleOnClickFullscreen}>Fullscreen</button>

      <Button onClick={spawnEnemies}>start</Button>
      <Box w="100%" h="80vh">
        <Unity unityContext={unityContext} />
      </Box>
    </>
  );
};
export default GamePlay;
