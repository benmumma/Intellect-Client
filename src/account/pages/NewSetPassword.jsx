import React, { useState, useContext } from 'react';
import { Box, Heading, HStack, Center, Text,  Divider, } from "@chakra-ui/react";
import MyHeader from "../../general/components/MyHeader";
import Footer from "../../general/components/Footer";
import { useIntellectInbox } from '../../intellect_inbox/context/IntellectInboxContext';
import { useNavigate } from 'react-router-dom';
import PasswordSetter from '../components/PasswordSetter';
import { useParams } from 'react-router-dom';


const NewSetPassword = ({arrival_url=false}) => {
    const {app} = useParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {inboxState, inboxDispatch} = useIntellectInbox();

    console.log(app);


    const intellectInboxUser = inboxState?.email_address || null;

    let app_name = null;
    let login_email = null;
    if (app === 'intellectinbox') {
        login_email = intellectInboxUser;
        app_name = 'Intellect Inbox';
    }


    const isEmailValid = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const hasPassword = (password) => {
        return password.length > 0;
    };

    const isButtonDisabled = !isEmailValid(email) || !hasPassword(password);


    return (
        <>
        <MyHeader />
        <Box py={4} px={{ base: 4, md: 8 }} minHeight="90vh">
        <Center width="100%">
        <Box width="100%" maxWidth="1000px">
            <Heading as="h2" size="lg" my={4}>Set Your Password for {app_name}</Heading>
            <Divider my={4} />
            <HStack m={4} spacing={2}>
                <Text>User Account:</Text>
                <Text fontWeight="bold">{login_email}</Text>
            </HStack>
            <PasswordSetter app={app} login_email={login_email} />
        </Box>
        </Center>
        </Box>
        <Footer />
    </>
    );
};

export default NewSetPassword;