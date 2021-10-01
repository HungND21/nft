import { extendTheme } from '@chakra-ui/react';

import color from './color';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: '#6e6b7b',
        fontFamily: 'Montserrat, Roboto, Helvetica, Arial, serif;'
      }
    }
  },
  colors: color,
  shadows: {
    content: '0 4px 24px 0 rgba(34,41,47,.1)',
    drawer: '0 4px 24px 0 rgba(34,41,47,.05)',
    button: '0 8px 25px -8px rgba(34,41,47,.5)'
  }
});
export default theme;
