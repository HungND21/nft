import { Box, Image, Text, IconButton, Stack, HStack } from '@chakra-ui/react';
import React from 'react';
import { MinusIcon } from '@chakra-ui/icons';
import { GiAlliedStar, GiCrossedSwords, GiSwordBreak } from 'react-icons/gi';

function CardClose({}) {
  // console.log('info', info);

  return (
    <>
      <Box>
        <Box position="relative">
          <Image
            src={`/assets/card-close/3.png`}
            width="100%"
            height="100%"
            // position="absolute"
            // top="0"
          />
        </Box>
      </Box>
    </>
  );
}

export default CardClose;
