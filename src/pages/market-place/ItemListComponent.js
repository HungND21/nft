import { ListItem, ListIcon } from '@chakra-ui/react';
import React from 'react';
import { FiDisc } from 'react-icons/fi';

function ItemListComponent({ name, value }) {
  return (
    <>
      <ListItem>
        <ListIcon as={FiDisc} />
        {name} = {Intl.NumberFormat().format(value)}
      </ListItem>
    </>
  );
}

export default ItemListComponent;
