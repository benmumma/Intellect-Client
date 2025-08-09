import React, { useState, useEffect } from 'react';
import { Box, Heading, Center, VStack, HStack, Text, Button, useToast, UnorderedList, ListItem, Divider, Link, ButtonGroup, Input, Flex, useMediaQuery} from '@chakra-ui/react';
import MyHeader from '../../general/components/MyHeader';
import Footer from '../../general/components/Footer';
import useColors from '../theming/useColors';
import {Link as RouterLink} from 'react-router-dom';
import { useIntellectInbox } from '../context/IntellectInboxContext';
import limits from '../../constants/limits';
import axios from 'axios';
// DEPRECATED: This page is archived. Subscription management is centralized via Mumapps-Auth.
import { API_BASE_URL, MANAGE_ACCOUNT_URL } from '../../constants/constants';
import { loadStripe } from '@stripe/stripe-js';
import gh from '../helpers/generic';

const ManageAccount = () => {
    const colors = useColors();
    const { inboxState } = useIntellectInbox();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [creditQty, setCreditQty] = useState(5);
    const [slotQty, setSlotQty] = useState(1);
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const toast = useToast();
    const my_key = process.env.REACT_APP_STRIPE_MODE === 'live' ? process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY : process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST;

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const fetchData = {user_id:inboxState.user_id};
            const fetchURL = API_BASE_URL+'ii/billing/subscription';
            console.log('Fetching subscription:', fetchURL, fetchData);
            const response = await axios.post(fetchURL, fetchData);
            console.log('Subscription response:', response.data)
            setSubscription(response.data.user);
        } catch (error) {
            console.error('Error fetching subscription:', error);
            toast({
                title: 'Error fetching subscription',
                description: 'Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (period) => {
        setIsProcessing(true);
    try {

        const dataObject = { user_id: inboxState.user_id, plan: period};
        console.log('Data Object:', dataObject);

        const response = await axios.post(`${API_BASE_URL}ii/billing/create-checkout-session`, dataObject, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const { sessionId } = response.data;

        if (!sessionId) {
            throw new Error('No session ID received from the server');
        }

        // Load Stripe.js
        const stripe = await loadStripe(my_key);

        if (!stripe) {
            throw new Error('Failed to load Stripe');
        }

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
            throw error;
        }

    } catch (error) {
        console.error('Error creating checkout session:', error);

    } finally {
        setIsProcessing(false);
    }
};

    const handleUpgrade = async (action) => {
        setIsProcessing(true);
        try {
            let fetchData = {user_id:inboxState.user_id, action:action };
            if(action === 'subscription_cancel' || action === 'subscription_update') {
                fetchData['subscription_id'] = subscription.stripe_subscription_id;
            }
            const fetchURL = API_BASE_URL+'ii/billing/update-subscription';
            console.log('Fetching subscription:', fetchURL, fetchData);
            const response = await axios.post(fetchURL, fetchData);
            console.log('Subscription response:', response.data)
            window.location.href = response.data.url;
            
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast({
                title: 'Error upgrading subscription',
                description: error.message || 'Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOneTimeBuy = async ({item, quantity}) => {
        try {
          const stripe = await loadStripe(my_key);
          
          const response = await fetch(API_BASE_URL+'ii/billing/onetime-checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product:item, quantity:quantity, user_id:inboxState.user_id}),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Response data:', data);
      
          const { sessionId } = data;
      
          if (!sessionId) {
            throw new Error('No sessionId received from the server');
          }
      
          const result = await stripe.redirectToCheckout({
            sessionId: sessionId,
          });
          
          if (result.error) {
            console.error(result.error.message);
          }
        } catch (error) {
          console.error('Error in handleCreditBuy:', error);
        }
      };


    return (
        <>
            <MyHeader />
            <Center>
                <Box p={8} maxWidth="800px" width="100%">
                    <Heading width="100%" textAlign="center" size="lg" mb={6}>Manage My Account</Heading>
                    <Box bg="yellow.50" border="1px solid" borderColor="yellow.200" p={4} borderRadius="md" mb={6}>
                        <Heading size="sm">This page has moved</Heading>
                        <Text mt={2}>Subscription upgrades, billing, and cancellations are now handled in our centralized portal.</Text>
                        <Link href={MANAGE_ACCOUNT_URL} isExternal color="teal.500">Open Manage Account</Link>
                    </Box>

                    <VStack spacing={6} align="stretch">
                        <Box bg={colors.bg.contrast} boxShadow="lg" p={6} borderRadius="md">
                            <HStack width="100%" alignItems="flex-start" flexDir={isMobile ? 'column' : 'row'}>
                            <VStack flex="1" borderRight={isMobile ? "0px" : "1px solid"} borderBottom={isMobile ? "1px solid" : "0px"} borderColor={colors.border.main}>
                            <Text fontWeight="bold" mb={2}>Email Address:</Text>
                            <Text>{inboxState.email_address}</Text>
                            <Text fontSize="sm" color={colors.text.context} mt={2} textAlign="center">
                                To change this, please e-mail intellectinbox@mumma.co
                            </Text>
                            </VStack>
                            <VStack flex="1" width="100%" alignItmes="center">
                            <Text fontWeight="bold" mb={2}>Password:</Text>
                            <Text>********</Text>
                            <Link as={RouterLink} color="teal" to="/setpassword/intellectinbox">Change Password</Link>
                            </VStack>
                            </HStack>
                        </Box>
                        <Box bg={colors.bg.contrast} boxShadow="lg" p={6} borderRadius="md">
                            <Heading size="sm">How Intellect Inbox works:</Heading>
                            <Text textColor={colors.text.main} mt={2}>Pay per use or subscribe, you choose:</Text>
                            <Divider my={4} />
                            <HStack width="100%" alignItems="flex-start">
                                <VStack flex="1">
                                <Text fontWeight="bold">Pay As You Go:</Text>
                                <UnorderedList>
                                <ListItem>Buy personalized course credits. Each credit allows you to create 1 personalized course.</ListItem>
                                <ListItem>Purchase course slots, which permanently increase the number of simultaneous courses you can take.</ListItem>
                                <ListItem>Only pay for what you use!</ListItem>
                            </UnorderedList>
                            </VStack>
                            <VStack flex="1">
                                <Text fontWeight="bold">Subscriptions:</Text>
                                <UnorderedList>
                                <ListItem>Billed monthly or annually for a discount.</ListItem>
                                <ListItem>Can be cancelled at any time.</ListItem>
                                <ListItem>Include unlimited personalized courses and 10 course slots for as long as you are a member.</ListItem>
                            </UnorderedList>
                            </VStack>
                            </HStack>

                            
                            </Box>

                        <Box bg={colors.bg.contrast} boxShadow="lg" p={6} borderRadius="md">
                            <Heading fontSize="lg" fontWeight="bold" mb={4}>My Subscription:</Heading>
                            {loading ? (
                                <Text>Loading subscription information...</Text>
                            ) : subscription.stripe_subscription_id ? (
                                <>
                                    <Text>Plan: {subscription.subscription_plan ? 'Premium' : 'Free'}</Text>
                                    <Text>Status: {gh.capitalize(subscription.subscription_status)}</Text>
                                    <Text>Next billing date: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</Text>
                                    <ButtonGroup as={Flex} flexDir={isMobile ? 'column' : 'row'}>
                                    <Button colorScheme="blue" mt={4} onClick={() => handleUpgrade('payment_method_update')} isLoading={isProcessing} loadingText="Processing...">
                                        Change Payment Method
                                    </Button>
                                    <Button colorScheme="blue" mt={4} onClick={() => handleUpgrade('subscription_update')} isLoading={isProcessing} loadingText="Processing...">
                                        Switch Plan
                                    </Button>
                                    <Button colorScheme="red" mt={4} onClick={() => handleUpgrade('subscription_cancel')} isLoading={isProcessing} loadingText="Processing...">
                                        Cancel Plan
                                    </Button>
                                    </ButtonGroup>
                                </>
                            ) : (
                                <>
                                    <Text>You are not currently subscribed to a premium plan.</Text>
                                    <Button as={Link} href={MANAGE_ACCOUNT_URL} isExternal colorScheme="teal" mt={4} width="100%">
                                        Manage Subscription in Portal
                                    </Button>
                                </>
                            )}
                        </Box>
                        <Box bg={colors.bg.contrast} boxShadow="lg" p={6} borderRadius="md">
                            <Heading size="md" width="100%" textAlign="center" mb={4}>One-Time Purchases:</Heading>
                            <HStack width="100%" alignItems="stretch" flexDir={isMobile ? 'column' : 'row'}>
                                <VStack flex="1" borderRight={isMobile ? "0px" : "1px solid"} borderBottom={isMobile ? "1px solid" : "0px"} borderColor={colors.border.main}>
                                <Heading size="sm">Available Course Credits:</Heading>
                                <Heading size="lg">{inboxState.add_course_credits}</Heading>
                                <VStack spacing={2} mt={4}>
                                    <Text>Buy more:</Text>
                                    <Input variant="filled" borderRadius="1px solid" fontWeight="bold" borderColor={colors.border.black} fontSize="xl" textAlign="center" type="number" value={creditQty} onChange={(e) => setCreditQty(e.target.value)} />
                                    {creditQty >= 5 && <>
                                    <Text fontSize="sm" color={colors.text.context}>Base Cost: ${(creditQty*4.99).toFixed(2)}</Text>
                                    <Text fontSize="sm" color={colors.text.success}>{gh.getDiscountText(creditQty)}</Text>
                                    </>}
                                    <Text fontWeight="bold">Cost: ${gh.getCreditCost(creditQty)} USD</Text>
                                    <Button colorScheme="green" size="lg" onClick={() => handleOneTimeBuy({item:'credit',quantity:creditQty})}>Buy {creditQty} credits</Button>
                                    <Text fontSize="sm" color={colors.text.context}>1 credit = 1 personalized course</Text>
                                </VStack>
                                </VStack>
                                <VStack flex="1" justifyContent="space-between">
                                <VStack width="100%">
                                <Heading size="sm">Available Course Slots:</Heading>
                                <HStack width="100%" justifyContent="space-between">
                                <Text>Included in Plan:</Text>
                                <Heading size="lg">{(limits[inboxState.user_tier].active_courses)}</Heading>
                                </HStack>
                                <HStack width="100%" justifyContent="space-between">
                                <Text>Additional Slots:</Text>
                                <Heading size="lg" textDecoration="underline">+{inboxState.add_course_slots}</Heading>
                                </HStack>
                                <HStack width="100%">
                                <Text>Total:</Text>
                                <VStack width="100%" alignItems="flex-end">
                                <Heading size="lg">{(limits[inboxState.user_tier].active_courses+inboxState.add_course_slots)}</Heading>
                                <Text fontSize="sm" color={colors.text.context}>active course slots</Text>
                                </VStack>
                                </HStack>
                                </VStack>

                                <VStack width="100%">
                                <Button width="100%" colorScheme="green" size="lg" onClick={() => handleOneTimeBuy({item:'slot',quantity:1})}>
                                    <VStack spacing={0}>
                                        <Text>Add 1 slot</Text>
                                        <Text fontSize="sm" fontWeight="normal">$19.99</Text>
                                    </VStack>
                                </Button>
                                <Button width="100%" colorScheme="green" size="lg" onClick={() => handleOneTimeBuy({item:'slot',quantity:2})}>
                                    <VStack spacing={0}>
                                        <Text>Add 2 slots</Text>
                                        <Text fontSize="sm" fontWeight="normal">$39.98</Text>
                                    </VStack>
                                </Button>
                                <Button width="100%" colorScheme="green" size="lg" onClick={() => handleOneTimeBuy({item:'slot',quantity:3})}>
                                    <VStack spacing={0}>
                                        <Text>Add 3 slots</Text>
                                        <Text fontSize="sm" fontWeight="normal">$59.97</Text>
                                    </VStack>
                                </Button>
                                </VStack>
                                </VStack>
                                

                            </HStack>

                        </Box>
                    </VStack>
                </Box>
            </Center>
            <Footer />
        </>
    );
};

export default ManageAccount;