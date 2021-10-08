import React from 'react';
import { Box, Text, Flex, Icon, Stack } from '@chakra-ui/react';
import { FiTrendingUp, FiActivity, FiAward } from 'react-icons/fi';

import GroupLeftIcon from './../farm/GroupLeftIcon';
import GroupRightIcon from './../farm/GroupRightIcon';

function Header() {
  return (
    <>
      <Box
        p="1.5rem"
        pos="relative"
        bg="linear-gradient(118deg,#FEBE43,rgba(247,196,87,.7))"
        color="white"
        borderRadius="8px"
        mb={7}
      >
        <Box pos="absolute" top={0} left={0}>
          <GroupLeftIcon />
        </Box>
        <Box pos="absolute" top={0} right={0}>
          <GroupRightIcon />
        </Box>
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Flex
            justifyContent="center"
            alignItems="center"
            w="70px"
            h="70px"
            borderRadius="100%"
            bg="primary.base"
            boxShadow="0 4px 24px 0 rgba(34,41,47,.1)"
            mb="1.5rem"
          >
            <Icon as={FiAward} w="28px" h="28px" />
          </Flex>
          <Text
            as="h4"
            textTransform="capitalize"
            mb="1.5rem"
            fontSize="50px"
            fontWeight="bold"
            lineHeight="60px"
          >
            Play To Earn
          </Text>
        </Flex>
      </Box>
    </>
  );
}

export default Header;
