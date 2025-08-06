import React from 'react';
import { Box, Heading, Text, VStack, Center, useMediaQuery, HStack, UnorderedList, ListItem, useColorModeValue, Divider, Link} from '@chakra-ui/react';
import MyHeader from '../general/components/MyHeader';
import Footer from '../general/components/Footer';
import { Link as RouterLink} from 'react-router-dom';
import PublicCourseDirectory from '../intellect_inbox/public/PublicCourseDirectory';



const About = () => {
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
                        width="100vw" // Modify this line
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
                            opacity: 0.7, // Adjust opacity here
                            zIndex: -1, // Make sure this stays behind the content
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
                            About Intellect Inbox
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
            <Center as="VStack">
            <VStack p={4} alignItems="flex-start" maxWidth="900px" spacing={8}>
                <Box p={4} width="100%" border="1px solid gray" boxShadow="md" backgroundColor={bgColor} borderRadius="10px">
                    <Heading as="h2" size="lg" mb={0} >
                        About Intellect Inbox
                    </Heading>
                    <Divider my={4}/>
                    <Text>
                        Intellect Inbox helps you learn any subject via simple daily lessons, personalized to your interests and knowledge level.<br />
                        Sign up for free and you can get daily lessons and access to any of our free courses: over 50 and counting!<br />
                        Premium users can build courses personalized to exactly what they want to learn and exactly where they are today, or you can buy these courses individually.<br />
                        And we're just getting started! Join us today and help us build the future of learning!
                    </Text>
                    </Box>
                    <Box p={4} width="100%" border="1px solid gray" boxShadow="md"  backgroundColor={bgColor} borderRadius="10px">
                    <Heading as="h2" size="lg" mb={0}>
                        Our Courses
                    </Heading>
                    <Divider my={4}/>
                    <PublicCourseDirectory />
                    </Box>
                    <Box p={4} width="100%" border="1px solid gray" boxShadow="md"  backgroundColor={bgColor} borderRadius="10px">
                    <Heading as="h2" size="lg" mb={0}>
                        About Mumma Labs
                    </Heading>
                    <Divider my={4}/>
                    <Text><Link fontWeight="bold" color="teal" as={RouterLink} to="https://www.mumma.co" target="_blank">Mumma Labs</Link> is a boutique software firm building products that help humans achieve more.<br />
                    Founded in 2023, we also launched <Link fontWeight="bold" color="teal" as={RouterLink} to="https://www.theforwardapp.com" target="_blank">Forward</Link> to help students, parents, and other high achievers accomplish more.<br />
                    Mumma Labs was founded in 2023 by Ben Mumma and also provides consulting services around data analytics, machine learning, AI, and software development.</Text>
                    </Box>
                    <Box p={4} width="100%" border="1px solid gray" boxShadow="md"  backgroundColor={bgColor}  borderRadius="10px">
                    <Heading as="h2" size="lg" mb={0}>
                        About Ben Mumma
                    </Heading>
                    <Divider my={4}/>
                    <Text>Ben Mumma has worked in software and analytics for almost 15 years. His goal with Mumma Labs is to build tools that combat the distraction economy that much of the modern internet represents.<br />
                    You can find out more about Ben on his website (<Link fontWeight="bold" color="teal" as={RouterLink} to="https://www.mumma.co/about" target="_blank">About Ben</Link>), by following him on <Link fontWeight="bold" color="teal" as={RouterLink} to="https://www.x.com/mummalabs" target="_blank">Twitter</Link>, or by reading him on <Link fontWeight="bold" color="teal" as={RouterLink} to="https://www.substack.com/@benmumma" target="_blank">Substack</Link>.</Text>
                    </Box>
            </VStack>
            </Center>
            <Box height="30vh"></Box>
            <Footer />
        </Box>
    );
};

export default About;