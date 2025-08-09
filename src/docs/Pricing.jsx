import React from 'react';
import { Box, Heading, Text, VStack, Center, useMediaQuery, HStack, UnorderedList, ListItem, useColorModeValue, Divider, Link} from '@chakra-ui/react';
import MyHeader from '../general/components/MyHeader';
import Footer from '../general/components/Footer';
import { MANAGE_ACCOUNT_URL } from '../constants/constants.js';



const Pricing = () => {
    const isMobile = useMediaQuery('(max-width: 600px)')[0];
    const bgColor = useColorModeValue('forwardWhite.100', 'gray.700');

    return (
        <Box width="100%">
            <MyHeader />
            <Center px={2} width="100%">
                <VStack spacing={2} width="100%">
                    <Center width="100%">
                        <VStack>
                            
                        <Box
                        width="100vw" 
                        height={isMobile ? '200px' : '200px'}
                        position="relative"
                    >
                        <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundImage: "url('/ii/ii_hero_v1_min.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'left',
                            opacity: 0.7, 
                            zIndex: -1, 
                          }}
                          />
                        <VStack
                        position="absolute"
                        top={isMobile ? '50%' : '55%'}
                        left="50%"
                        width="100%"
                        transform="translate(-50%, -50%)"
                        textAlign="center"

                        spacing={isMobile ? 0 : 2}
                        >
                            <Box
                            backgroundColor="rgba(255, 255, 255, 0.8)"
                            py={8}
                            px={16}
                            m={2}
                            boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                            borderRadius={8}
                            >
                        <Heading
                            as="h1"
                            size={isMobile ? 'lg': "xl"}
                            color="black"
                            mb={3}
                        >
                            Intellect Inbox Pricing
                        </Heading>
                        <Text fontWeight={isMobile ? '' : 'bold'} fontSize={isMobile ? 'sm' : 'lg'}
                                color="black">
                            </Text>
                            </Box>
                            </VStack>
                        </Box>
                        </VStack>
                    </Center>
                    </VStack>
            </Center>
            {/* Pricing Content */}
            <Center as="VStack" flexDir="column">
                <Text my={4} fontSize="xl" fontStyle="oblique">Intellect Inbox's core services are free forever!</Text>
            <HStack p={4} alignItems="flex-start" maxWidth="900px" spacing={8}>
                <Box p={4} width="100%" border="1px solid gray" boxShadow="md" backgroundColor={bgColor} borderRadius="10px">
                    <Heading as="h2" size="lg" mb={0} >
                        Free Plan
                    </Heading>
                    <Text fontStyle="oblique" borderBottom="1px solid" mb={2}>Enough for most users.</Text>
                    <UnorderedList>
                        <ListItem>Daily Lessons: get daily content on a topic or topics that you want to learn about!</ListItem>
                        <ListItem>Access to our public directory of courses: over 50 available and counting!</ListItem>
                        <ListItem>Take up to one course at a time.</ListItem>
                        <ListItem>Ability to build one personalized course - get any subject taught to you by an expert.</ListItem>
                        {/* Legacy one-time purchases removed under centralized premium */}
                    </UnorderedList>
                    <Text>&nbsp;</Text>
                    <Text>&nbsp;</Text>
                    <Divider my={4}/>
                    <Text textAlign="center" my={4} fontSize="xl" fontWeight="bold">Free Forever!</Text>
                    </Box>
                    <Box p={4} width="100%" border="1px solid gray" boxShadow="md"  backgroundColor={bgColor}  borderRadius="10px">
                    <Heading as="h2" size="lg" mb={0}>
                        Premium
                    </Heading>
                    <Text fontStyle="oblique" borderBottom="1px solid" mb={2}>Supercharge Your Learning!</Text>
                    <UnorderedList>
                        <ListItem>Discuss your lesson: chat with our AI to refine the lesson, ask questions, etc.</ListItem>
                        <ListItem>Build your own subjects: create hyper-focused courses on anything!</ListItem>
                        <ListItem>Learn Anything Now: build a lesson directly on any topic imaginable.</ListItem>
                        <ListItem>Take up to 10 courses at a time, scheduled as you like throughout the week!</ListItem>
                        <ListItem>Modify our existing courses to fit your needs.</ListItem>
                        <ListItem>Unlimited Personalized Courses: build a course for yourself on any topic you'd like!</ListItem>
                        <ListItem>Gain early access to our new features!</ListItem>
                    </UnorderedList>
                    <Divider my={4}/>
                    <Text textAlign="center" my={4} fontSize="xl" fontWeight="bold">Only $1.99 per month</Text>
                    </Box>
                
            </HStack>
            <Text my={4} fontSize="xl" fontStyle="oblique">
                Upgrade to Premium for $1.99/month via your{' '}
                <Link href={MANAGE_ACCOUNT_URL} color="teal.500" isExternal>Manage Account</Link>.
            </Text>

            </Center>
            <Box height="15vh"></Box>
            <Footer />
        </Box>
    );
};

export default Pricing;