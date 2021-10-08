import { List, ListItem, ListIcon, OrderedList, UnorderedList, Box } from '@chakra-ui/react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { menuItems } from '../menu-item';

function MenuList({ handleCloseDrawer }) {
  const navItems = menuItems.map((item) => {
    return (
      // _hover={{ background: 'linear-gradient(118deg,#7367f0,rgba(115,103,240,.7))' }}
      <ListItem key={item.id}>
        {/* {item.type === 'group' &&  } */}
        <NavLink to={item.url} onClick={handleCloseDrawer} exact activeClassName="menu-item-active">
          <Box
            display="flex"
            alignItems="center"
            p={2}
            role="group"
            cursor="pointer"
            borderRadius="0.4rem"
            overflow="hidden"
            textTransform="capitalize"
            _hover={{
              backgroundColor: 'primary.light',
              color: 'primary.base',

              transition: 'all .25s ease'
            }}
          >
            <ListIcon
              as={item.icon}
              _groupHover={{ transform: 'translateX(5px)' }}
              transition="transform .25s ease"
            />
            <Box
              as="span"
              _groupHover={{ transform: 'translateX(5px)' }}
              transition="transform .25s ease"
            >
              {item.title}
            </Box>
          </Box>
        </NavLink>
      </ListItem>
    );
  });
  return (
    <>
      <List spacing={2}>{navItems}</List>
    </>
  );
}

export default MenuList;
