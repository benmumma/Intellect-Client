import React, {useState} from 'react';
import { Box, Button, FormControl, FormLabel, Input, Checkbox, Link, useToast, Text, Tooltip, useMediaQuery, useColorModeValue } from "@chakra-ui/react";
import { Link as ReachLink } from 'react-router-dom';

const IntellectSignupForm = ({ handleSignup, mode="hero"}) => {
    const [email, setEmail] = useState("");
    const [isChecked, setIsChecked] = useState(true);
    const [isMobile] = useMediaQuery("(max-width: 600px)");

    const isEmailValid = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };
    const isButtonDisabled = !isEmailValid(email) || !isChecked;
    const [showTooltip, setShowTooltip] = useState(false);
    let backgroundColor = useColorModeValue('rgba(0,20,20, 0.1)','rgba(0,20,20, 1)');
    let textColor = useColorModeValue('black','white');
    if (mode === 'hero') {
        backgroundColor = 'rgba(0,20,20, 1)';
        textColor = 'white';
    }
    


    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

    const handleSignupIntellect = (event) => {
        handleSignup(event, email, 'intellectinbox');
        setEmail("");
    }

    const handleButtonHover = () => {
        if (isButtonDisabled) {
            setShowTooltip(true);
        }
    };

    const handleButtonLeave = () => {
        setShowTooltip(false);
    };

    return (
        <form onSubmit={handleSignupIntellect}>
            <Box width="100%" px={2}>
            <Text textAlign="center" width="100%" fontSize="xl" fontWeight="bold">Start Today</Text>
            <Text textAlign="center" width="100%" fontSize="md" mb={4}>Get personalized lessons straight to your inbox!</Text>
            <FormControl id="email" my={2}>
                <Input  type="email" 
                        fontWeight="bold" 
                        size="lg" 
                        textAlign="center" 
                        variant="outline" 
                        borderRadius={0} 
                        backgroundColor={backgroundColor}
                        boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                        color={textColor}
                        placeholder="Enter E-mail" 
                        _placeholder={{opacity:0.9,color:'inherit'}} 
                        value={email} 
                        onChange={handleEmailChange} />
            </FormControl>
            <FormControl id="pptos" my={3}>
                <Checkbox size="xl" colorScheme="teal" isChecked={isChecked} onChange={handleCheckboxChange}><Text fontSize={isMobile ? 'sm' : 'md'}>I agree to Mumma Lab's <Link color="teal" fontWeight="bold" as={ReachLink} to="/tos" target="_blank">Terms of Service</Link> and <Link color="teal" fontWeight="bold" as={ReachLink} to="/privacy" target="_blank">Privacy Policy</Link></Text></Checkbox>
            </FormControl>
            <Tooltip label="Please enter a valid email and agree to the terms of service and privacy policy" isOpen={showTooltip}>
                <Box onMouseEnter={handleButtonHover} onMouseLeave={handleButtonLeave}>
              <Button   my={2} py={6} fontSize="xl" cursor="" variant="solid" colorScheme="green" width="100%" type="submit" 
                        isDisabled={isButtonDisabled} _disabled={{opacity:1, cursor:'not-allowed'}}
                        >
                  Sign Up
              </Button>
              </Box>
            </Tooltip>
            </Box>
        </form>
    );
};

export default IntellectSignupForm;
