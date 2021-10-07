import { Box, Image, Text, IconButton, Stack ,HStack} from '@chakra-ui/react';
import React from 'react';
import { MinusIcon } from '@chakra-ui/icons';
import {GiAlliedStar, GiCrossedSwords, GiSwordBreak} from 'react-icons/gi';

function DisplayOpenedCards({ info, text = false, isCart = false, onremove, isDetail = false }) {
  // console.log('info', info);

  return (
    <>
      <Box>
        <Box position="relative">
          <Stack position="absolute" top="0" right="0" zIndex="1">
            {isCart && (
              <IconButton
                position="relative"
                icon={<MinusIcon />}
                colorScheme="red"
                onClick={onremove}
              ></IconButton>
            )}
          </Stack>
          {info && (
            <Image src={`/assets/card/rarity/${info['rarity']}.png`} width="100%" height="100%" />
          )}
          {info && (
            <Image
              src={`/assets/card/element/${info['element']}.png`}
              width="100%"
              height="100%"
              position="absolute"
              top="0"
            />
          )}
          {info && (
            <Image
              src={`/assets/char/T_${
                info['teamId'].teamId ? info['teamId'].teamId : info.teamId
              }.png`}
              width="100%"
              height="100%"
              position="absolute"
              top="0"
              left="11.5%"
              transform="translateX(-11.25%)"
            />
          )}

          {text && (
            <Box
              // bgRepeat="no-repeat"
              // bgSize="100% 100%"
              position="absolute"
              width="100%"
              bottom="12%"
              left="0%"
              p="0"
              // color="white"
              align="center"
              color="#283046"
              fontSize={24}
              fontWeight="bold"
            >
              {/* <Text>NFT {info['tokenId']}</Text> */}
              <Text fontSize={isDetail ? 25 :13}>NFT {info && info.nftId}</Text>
              <HStack justify="center" spacing="24px" >
                <HStack fontSize={isDetail ? 23 :13} spacing="5px">
                  <GiAlliedStar/>  
                  <Text>{info && info.level}</Text>
                  </HStack>
                  <HStack fontSize={isDetail ? 23 :13} spacing="5px">
                  <GiCrossedSwords/>  
                  <Text>{info && info.attack}</Text>
                  </HStack>
              </HStack>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default DisplayOpenedCards;
