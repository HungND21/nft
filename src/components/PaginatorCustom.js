import { useColorMode, useTheme } from '@chakra-ui/react';
import { Container, Next, PageGroup, Paginator, Previous } from 'chakra-paginator';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
const baseStyles = {
  w: 7,
  fontSize: 'sm'
};
const activeStyles = {
  ...baseStyles,
  _hover: {
    bg: '#FEBE43'
  },
  bg: '#FEBE43'
};
const normalStyles = {
  ...baseStyles,
  // bg: 'white',
  // borderRadius: '1rem',

  _hover: {
    bg: '#FEBE43'
  }
  // bg: 'blue.300'
};
function PaginatorCustom({ pagesQuantity, currentPage, onPageChange }) {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  // console.log(pagesQuantity, currentPage, onPageChange);
  return (
    <>
      <Paginator
        pagesQuantity={pagesQuantity > 0 && pagesQuantity}
        currentPage={currentPage}
        onPageChange={onPageChange}
        activeStyles={activeStyles}
        normalStyles={normalStyles}
        outerLimit={3}
        innerLimit={2}
      >
        <Container align="center" justify="center">
          <Previous variant="link">
            <FiChevronLeft color={theme.colors.iconPaginator} strokeWidth={4} size={24} />
            {/* Or an icon from `react-icons` */}
          </Previous>
          <PageGroup isInline align="center" />
          <Next variant="link">
            <FiChevronRight color={theme.colors.iconPaginator} strokeWidth={4} size={24} />
            {/* Or an icon from `react-icons` */}
          </Next>
        </Container>
      </Paginator>
    </>
  );
}

export default PaginatorCustom;
