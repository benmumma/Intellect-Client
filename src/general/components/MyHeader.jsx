
import React from 'react';
import { Heading, ButtonGroup, Button, VStack, Box, Flex, Link, useColorModeValue, useDisclosure, HStack, Image, Text, IconButton } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { FaCog, FaEnvelope, FaHome } from "react-icons/fa";
import NewContactModal from './NewContactModal';
import { Link as RouterLink } from 'react-router-dom';
const MyHeader = ({...props}) => {

      const isMobile = window.innerWidth < 768;
const { isOpen: isContactOpen, onOpen: onContactOpen, onClose: onContactClose } = useDisclosure();
const trackCustomEvent = (eventName) => {
      if (window.plausible) {
        window.plausible(eventName);
      }
    };

const handleContactModalOpen = () => {
      trackCustomEvent('Contact Modal Open');
      onContactOpen();
}

let appName = "Intellect Inbox";
let appTagline = "Your Personalized Learning Platform";
let appLogo = "/home/ii-v1.png";
let homeLink = "/";
let homeButton = <Box as={RouterLink} to="/" width="40px"><Image src='/home/m_consulting_round.png' width="40px" boxShadow="lg" borderRadius="40px"  /></Box>


return (
      <>
      <Flex as="header" p={4} borderBottomWidth="1px" justifyContent="space-between" alignItems="center" {...props}>
            <Link as={RouterLink} to={homeLink} style={{ textDecoration: "none" }}>
            <HStack alignItems="center">
                  <Image src={appLogo} width="65px" boxShadow="lg" borderRadius="40px"/>
                  <VStack alignItems="flex-start">
                  <Heading as="h1" size="lg">
                  {appName}
                  </Heading>
                  <Heading as="h2" size="xs" mt={1} fontWeight="normal" display={{ base: 'none', md: 'block' }}>
                  {appTagline}
                  </Heading>
                  </VStack>
            </HStack>
            </Link>
      
      <ButtonGroup direction={{ base: 'column', md: 'row' }}>
            {!isMobile && <>
      <Button as={RouterLink} borderRadius="20px" to="/about">About</Button>
            <Button as={RouterLink} borderRadius="20px" to="/pricing">Pricing</Button>
            </>}
      <Button
      leftIcon={<FaEnvelope />}
      colorScheme="teal"
      onClick={handleContactModalOpen}
      variant="solid" boxShadow="lg"
      borderRadius="20px"
      >
            <Text display={{ base: 'none', md: 'block' }}>Contact</Text>
      </Button>
      {homeButton}
      <Button colorScheme="teal" variant="outline" display={'none'} borderRadius={0}><FaCog /></Button>
      <ColorModeSwitcher  borderRadius="20px" bg="teal" color="white"/>
      </ButtonGroup>
      </Flex>
      <NewContactModal
      isOpen={isContactOpen}
      onClose={onContactClose}
      />
      </>);
}

export default MyHeader;
