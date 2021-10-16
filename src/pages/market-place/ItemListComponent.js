import { ListItem, ListIcon, Text } from '@chakra-ui/react';
import React from 'react';
import { FiDisc } from 'react-icons/fi';

function ItemListComponent({ name, value, infoNft }) {
  console.log('infoNft', infoNft);
  return (
    <>
      <ListItem>
        <ListIcon as={FiDisc} />
        {name} = {value}{' '}
        <Text color="green">{infoNft && `( + ${Math.floor(infoNft.attack)})`}</Text>
        {/* {+value ? Intl.NumberFormat().format(value) : value} */}
      </ListItem>
    </>
  );
}

export default ItemListComponent;
