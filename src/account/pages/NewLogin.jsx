import React, { useState, useContext } from 'react';
import { Box, Button, Heading, HStack, Center, Link, Text, VStack, Divider, UnorderedList} from "@chakra-ui/react";
import MyHeader from "../../general/components/MyHeader";
import Footer from "../../general/components/Footer";
import { Link as ReachLink } from 'react-router-dom';
import { useIntellectInbox } from '../../intellect_inbox/context/IntellectInboxContext';
import { useNavigate, useParams } from 'react-router-dom';

import IntellectLoginForm from '../components/IntellectLoginForm';
import useAuth from '../hooks/useAuth';
import { MANAGE_ACCOUNT_URL } from '../../constants/constants';

const NewLogin = ({arrival_url=false}) => {
  const {app} = useParams();
    const navigate = useNavigate();
    let app_code = "2";
    if (app === 'intellectinbox') {
        app_code = "2";
    }
    const [value, setValue] = useState(app_code);

    const {inboxState, inboxDispatch} = useIntellectInbox();
    const intellectInboxUser = inboxState?.email_address || null;

    const { loginWithPassword } = useAuth();

    const handleChange = (val) => setValue(val);

    return (
        <>
        <MyHeader />
        <Box py={4} px={{ base: 4, md: 8 }} minHeight="90vh">
          <Center width="100%">
        <Box width="100%" maxWidth="1000px">
            <Heading as="h2" size="lg" my={4}>Login To Your Account</Heading>
            <Text my={4}  fontSize="sm">Need an account?&nbsp;<Link as={ReachLink} fontWeight="bold" color="teal" to={"/signup/"+app}>Create One!</Link></Text>
            <HStack width="100%">
                
                <Button flex="1" size="lg" borderRadius={"20px"} onClick={() => handleChange("2")} colorScheme={value === "2" ? "teal" : "gray"}>
                <VStack spacing={0}>
                        <Text>Intellect Inbox</Text>
                        <Text fontSize="xs" fontWeight="thin">Daily Educational Lessons</Text>
                        </VStack>
                    </Button>
                    
            </HStack>
            <Divider my={4} />

            {value === "2" && !intellectInboxUser && (
                <IntellectLoginForm
                arrival_url={arrival_url}
                mode="login" />
            )}
            {value === "2" && intellectInboxUser && (
                <VStack spacing={2}>
                <Text>You are already logged in as {intellectInboxUser} (<Link color="teal" fontWeight="bold" href={MANAGE_ACCOUNT_URL}>Manage Account</Link>)</Text>
                <Link color="teal" fontWeight="bold" as={ReachLink} to="/intellectinbox">Go to Intellect Inbox</Link>
                </VStack>
            )}
            <UnorderedList>
            </UnorderedList>
        </Box>
        </Center>
        </Box>
        <Footer />
    </>
    );
};

export default NewLogin;