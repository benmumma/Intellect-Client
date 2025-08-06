// IntellectInboxLoginForm.js

import React, {useState} from 'react';
import { FormControl, FormLabel, Input, Button, Link, useColorModeValue} from "@chakra-ui/react";
import useAuth from '../hooks/useAuth';

const IntellectLoginForm = ({ mode="hero"}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginWithPassword } = useAuth();

    const handleLoginIntellect = async (event) => {
        event.preventDefault();
        const { data, error } = await loginWithPassword(email, password, 'intellectinbox');
        if (error) {
            console.error('Error signing in:', error);
        } else {
            console.log('User signed in:', data);
        }
    };
    

    
    let bgColor = useColorModeValue('gray.100','gray.700');
    let textColor = useColorModeValue('black','white');
    let bdColor = useColorModeValue('gray.200','gray.600');
    if (mode === 'hero') {
        bgColor = 'teal.800';
        textColor = 'white';
        bdColor = 'teal.600';
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
        <form onSubmit={handleLoginIntellect}>
            <FormControl id="email" my={2}>
                <FormLabel>Email address</FormLabel>
                <Input type="email"
                fontWeight="bold" 
                size="lg" 
                textAlign="center" 
                variant="outline" 
                borderRadius={0} 
                backgroundColor={bgColor}
                boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                color={textColor}
                placeholder="Enter E-mail" 
                _placeholder={{opacity:0.9,color:'inherit'}} 
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" my={2}>
                <FormLabel>Password</FormLabel>
                <Input type="password"
                fontWeight="bold" 
                size="lg" 
                textAlign="center" 
                variant="outline" 
                borderRadius={0} 
                backgroundColor={bgColor}
                boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                color={textColor}
                placeholder="Password" 
                _placeholder={{opacity:0.9,color:'inherit'}} 
                 value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <Button my={4} width="100%" colorScheme="green" type="submit" isDisabled={isButtonDisabled}>
                Login
            </Button>
        </form>
    );
};

export default IntellectLoginForm;
