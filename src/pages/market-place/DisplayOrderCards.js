import { Box, Image, Text, HStack, Flex } from '@chakra-ui/react';
import React from 'react';
import {GiAlliedStar, GiCrossedSwords} from 'react-icons/gi';

function DisplayOrderCards({ info, text = false, isOne = false }) {
  // console.log('info', info);

  return (
    <>
      <Box>
        <Box position="relative">
          {info && (
            <Image src={`/assets/card/rarity/${info.rarity}.png`} width="100%" height="100%" />
          )}
          {info && (
            <Image
              src={`/assets/card/element/${info.element}.png`}
              width="100%"
              height="100%"
              position="absolute"
              top="0"
            />
          )}
          {info && (
            <Image
              src={`/assets/char/T_${info.teamId}.png`}
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
              position="absolute"
              width="100%"
              bottom={isOne ? '13.5%' : '13.5%'}
              left="0%"
              p="0"
              // color="white"
              align="center"
              color="#283046"
              fontSize={24}
              fontWeight="bold"
            >
              {/* <Text>NFT {info['tokenId']}</Text> */}
              <Text fontSize={isOne ? "60%" : "30%"}>NFT {info && info.nftId}</Text>
              <HStack justify="center" spacing="24px" fontSize={isOne ? "60%" : "30%"}>
                <HStack spacing="5px">
                  <GiAlliedStar/>  
                  <Text>{info && info.level}</Text>
                  </HStack>
                  <HStack spacing="5px">
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

export default DisplayOrderCards;
