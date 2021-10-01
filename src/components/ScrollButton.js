import React, { useState } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';
import { Box, Button, useColorMode, useTheme } from '@chakra-ui/react';

const ScrollButton = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <>
      <Box
        onClick={scrollToTop}
        position="fixed"
        bottom={10}
        right={2}
        display={visible ? 'inline' : 'none'}
      >
        <Button colorScheme={colorMode === 'dark' ? theme.colors.dark.base : 'purple'}>
          <FaArrowCircleUp />
        </Button>
      </Box>
    </>
  );
};

export default ScrollButton;
