import React from 'react';
import { Spinner } from '@chakra-ui/react';
//-----------------------|| Loader ||-----------------------//

const Loader = (props) => {
  return <Spinner color="primary.base" thickness="4px" speed="0.65s" {...props} />;
};

export default Loader;
