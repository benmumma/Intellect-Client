import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Radio, RadioGroup, Heading, HStack, Center, Checkbox, Link, Text, VStack, Divider, UnorderedList, ListItem, useToast } from "@chakra-ui/react";
import MyHeader from "../../general/components/MyHeader";
import Footer from "../../general/components/Footer";
import IntellectSignupForm from '../components/IntellectSignupForm';
import { Link as ReachLink, useParams } from 'react-router-dom';
import { useIntellectInbox } from '../../intellect_inbox/context/IntellectInboxContext';

import useAuth from '../hooks/useAuth';
import { MANAGE_ACCOUNT_URL } from '../../constants/constants';


const NewSignup = ({isSecret=false, app_override=null, showForward=true, showIntellectInbox = true}) => {
    const {app} = useParams();
    const { signInWithOtp, loading } = useAuth();
    let app_code = app_override || "2";
    if (app === 'intellectinbox' || isSecret) {
        app_code = "2";
    }
    const [value, setValue] = useState(app_code);

    const handleChange = (val) => setValue(val);

    const {inboxState, dispatch:inboxDispatch} = useIntellectInbox();

    const [intellectInboxUser, setIntellectInboxUser] = useState(null);

    useEffect(() => {
        if (inboxState?.email_address) {
            setIntellectInboxUser(inboxState.email_address);
        }
    }, [inboxState]);


    const handleSignup = async (event, email, app_name) => {
        event.preventDefault();
            await signInWithOtp(email, app_name);
    }

    
    
    return (
        <>
            <MyHeader />
            <Box py={4} px={{ base: 4, md: 8 }} minHeight="90vh">
                <Center width="100%">
                    <Box width="100%" maxWidth="1000px">
                        <Heading as="h2" size="lg" my={4}>Signup For An Account</Heading>
                        <HStack width="100%">
                            <Button flex="1" size="lg" borderRadius={"20px"} onClick={() => handleChange("2")} colorScheme={value === "2" ? "teal" : "gray"}>
                                <VStack spacing={0}>
                                    <Text>Intellect Inbox</Text>
                                    <Text fontSize="xs" fontWeight="thin">Daily Educational Lessons</Text>
                                </VStack>
                            </Button>
                        </HStack>
                        <Divider my={4} />

                        {value === "2" && !intellectInboxUser && isSecret && (
                            <IntellectSignupForm 
                            handleSignup={handleSignup}
                            mode="signin"
                            />
                            )}
                            {value === "2" && !intellectInboxUser && !isSecret && (
                            <IntellectSignupForm 
                            handleSignup={handleSignup} 
                            mode="signin"
                            />
                        )}
                        {value === "2" && intellectInboxUser && (
                            <VStack spacing={2}>
                                <Text>You are already signed up for Intellect Inbox as {intellectInboxUser} (<Link href={MANAGE_ACCOUNT_URL} color="teal" fontWeight="bold">Manage Account</Link>)</Text>
                                <Link color="teal" fontWeight="bold" as={ReachLink} to="/intellectinbox">Go to Intellect Inbox</Link>
                            </VStack>
                        )}
                        
                        {(value === "2" && !intellectInboxUser) && (<><Divider my={4} />
                        <UnorderedList>
                            <ListItem>Intellect Inbox is an early stage product, we will be iterating and improving it regularly!</ListItem>
                            <ListItem>We want your feedback! Use the "Contact" button at the top of the page.</ListItem>
                            <ListItem>Already have an account? <Link textColor="teal" fontWeight="bold" as={ReachLink} to="/login/intellectinbox">Sign in here.</Link></ListItem>
                        </UnorderedList>
                        </>)}
                    </Box>
                </Center>
            </Box>
            <Footer />
        </>
    );
};

export default NewSignup;