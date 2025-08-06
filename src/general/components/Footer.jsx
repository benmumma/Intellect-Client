import React from 'react';
import { Box, Text, Center, useColorModeValue } from '@chakra-ui/react';

const Footer = ({...props}) => {
  const currentYear = new Date().getFullYear();
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box backgroundColor={bgColor} py={4} {...props}>
      <Center>
        <Text fontSize="sm">
          &copy; {currentYear} Mumma Labs, LLC. All rights reserved.
        </Text>
      </Center>
    </Box>
  );
};

export default Footer;
