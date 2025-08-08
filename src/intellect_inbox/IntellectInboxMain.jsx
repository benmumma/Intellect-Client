import React, { useState, useEffect } from 'react';
import { useNavigate, Link as ReachLink } from 'react-router-dom';
import { useToast, useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import { useIntellectInbox } from './context/IntellectInboxContext';
import useCentralizedAuth from '../auth/useCentralizedAuth';
import { REACT_APP_USE_CENTRALIZED_AUTH } from '../constants/constants';
import useAuth from '../account/hooks/useAuth';
import MyHeader from '../general/components/MyHeader';
import Footer from '../general/components/Footer';
import HeaderBar from './components/navigation/HeaderBar';

import IntellectSignupForm from '../account/components/IntellectSignupForm';
import IntellectLoginForm from '../account/components/IntellectLoginForm';
import CourseSection from './courses/course_table/CourseSection';

import { Box, VStack, Center, Heading, Button, Divider, Text, HStack } from '@chakra-ui/react';
import HomePageText from './content/HomePageText';
import PublicCourseDirectory from './public/PublicCourseDirectory';
import useColors from './theming/useColors';

function IntellectInboxMain() {
  const { iiSession, loadingSession, userLoaded, inboxState, dispatch } = useIntellectInbox();
  const useCentralized = REACT_APP_USE_CENTRALIZED_AUTH;
  const { isAuthenticated: cAuthenticated } = useCentralizedAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const { signInWithOtp, signOut } = useAuth();

  const toast = useToast();
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const boxBg = useColorModeValue('gray.50', 'gray.900');
  const colors = useColors()

  useEffect(() => {
    if (iiSession) {
      dispatch({ type: 'UPDATE_STATE', payload: { user_id: iiSession.user.id, email_address: iiSession.user.email } });
    }
  }, [iiSession, dispatch]);

  const handleSignup = async (event, email, app_name) => {
    event.preventDefault();
    const { error } = await signInWithOtp(email, app_name);
    if (error) {
      toast({
        title: "Error",
        description: 'Error signing up - please check back soon!',
        status: "error",
        position: 'top',
        isClosable: true,
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut('intellectinbox');
    if (!error) {
      dispatch({ type: 'INBOX_SIGN_OUT' });
      dispatch({ type: 'RESET_STATE' });
      navigate('/');
    } else {
      toast({
        title: 'Error',
        description: 'Error signing out',
        status: 'error',
        position: 'top',
        isClosable: true,
      });
    }
  };

  if (loadingSession) {
    return (
      <Box>
        <MyHeader />
        <Center>
          <Heading as="h2" size="md">Loading...</Heading>
        </Center>
        <Footer />
      </Box>
    );
  }

  return (
    <Box width="100%">
      <MyHeader />
      {(inboxState.userStatus === 'signed_in' || (useCentralized && cAuthenticated)) && (
        <HeaderBar />
      )}
      <Center px={2} width="100%">
        <VStack spacing={2} width="100%">
          {!(inboxState.userStatus === 'signed_in' || (useCentralized && cAuthenticated)) && (
            <Center width="100%">
              <VStack>
                <Box
                  width="100vw"
                  height={isMobile ? '600px' : '600px'}
                  backgroundImage="url('/ii/ii_hero_v1_min.png')"
                  backgroundSize="cover"
                  backgroundPosition="left"
                  position="relative"
                >
                  <VStack
                    color="white"
                    position="absolute"
                    top={isMobile ? '50%' : '55%'}
                    left="50%"
                    width="100%"
                    transform="translate(-50%, -50%)"
                    textAlign="center"
                    spacing={isMobile ? 0 : 2}
                  >
                    <Heading as="h1" size={isMobile ? 'lg' : "2xl"}>
                      Your Personal Tutor
                    </Heading>
                    <Text fontWeight={isMobile ? '' : 'bold'} fontSize={isMobile ? 'sm' : 'lg'}>
                      Learn any topic with personalized courses built for you!
                    </Text>

                    <Divider my={2} width="30%" />
                    <Box
                      width={isMobile ? '95%' : '50%'}
                      backgroundColor="rgba(0,20,20, 0.7)"
                      borderRadius={8}
                      px={8}
                      py={12}
                      boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                    >
                      {isSignup ? (
                        <IntellectSignupForm handleSignup={handleSignup} />
                      ) : (
                        <IntellectLoginForm mode="hero" />
                      )}
                    </Box>
                    <HStack width={isMobile ? '95%' : '50%'}>
                    <Button color="white" size="md" width="100%" variant="unstyled" onClick={() => setIsSignup(!isSignup)}>
                      {isSignup ? 'Log In' : 'Sign Up'}
                    </Button>
                    <Text> | </Text>
                    <Button size="md" width="100%" variant="unstyled" onClick={() => navigate('/reset-password')}>
                      Forgot Password?
                    </Button>
                    </HStack>
                  </VStack>
                </Box>
                <Box width="100%" maxWidth="1000px" p={4} bgColor={colors.bg.main} boxShadow="md" mb={4}>
                  <Center>
                    <VStack width="100%" spacing={4} p={4}>
                <Heading as="h2" size="md">Browse our Public Courses</Heading>
                <Text fontStyle="oblique">All of our public courses are free! Enroll today with just your e-mail!</Text>
                <PublicCourseDirectory maxHeight="600px" />
                    </VStack>
                </Center>
                </Box>
                <HomePageText />
              </VStack>
            </Center>
          )}
          {(inboxState.userStatus === 'signed_in' || (useCentralized && cAuthenticated)) && (
            <>
              <CourseSection />
              {/*<Heading as="h2" size="md" mt={2}>My Lessons</Heading>
              <PastLessons />*/}
              <Divider py={10} />
              <Button my={2} onClick={handleSignOut} colorScheme="red">Sign Out</Button>
            </>
          )}
        </VStack>
      </Center>
      <Footer />
    </Box>
  );
}

export default IntellectInboxMain;