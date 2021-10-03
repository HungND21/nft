import { Box, Image, Text , IconButton, Stack} from '@chakra-ui/react';
import React from 'react';
import { MinusIcon} from '@chakra-ui/icons'

function DisplayOpenedCards({ info, text = false, isCart = false, onremove }) {
  return (
    <>
      <Box>
        <Box position="relative">
          <Stack position="absolute" top="0" right="0" zIndex="1">
          {isCart && (
              <IconButton position="relative" icon={<MinusIcon />} colorScheme="red" onClick={onremove} ></IconButton>)}
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
              width="65%"
              height="65%"
              position="absolute"
              top="13.5%"
              left="22.5%"
              transform="translateX(-11.25%)"
            />
          )}
          
          {text && (
            <Box
              bgRepeat="no-repeat"
              bgSize="100% 100%"
              position="absolute"
              width="80%"
              bottom="2%"
              left="10%"
              p="14% 8% 3%"
              color="white"
              align="center"
            >
              {/* <Text>NFT {info['tokenId']}</Text>
              <Text>{info && info['rarity']}</Text> */}
            </Box>
          )}

        </Box>
      </Box>
    </>
  );
}

export default DisplayOpenedCards;
