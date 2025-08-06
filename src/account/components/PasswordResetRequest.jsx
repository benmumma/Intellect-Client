import React, { useState } from 'react'
import { ii_supabase } from '../../constants/supabaseClient';
import { Box, Button, Heading, HStack, Center, Link, Text, Input, Divider, UnorderedList, VStack} from "@chakra-ui/react";
import MyHeader from "../../general/components/MyHeader";
import Footer from "../../general/components/Footer";
import useColors from '../../intellect_inbox/theming/useColors';
import { set } from 'date-fns';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [messageColor, setMessageColor] = useState('red') // ['red', 'green']
  const colors = useColors();

  const handlePasswordReset = async () => {
    const { error } = await ii_supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://www.intellect.email/setpassword/intellectinbox',
      })
    if (error) {
      setMessage('Error sending password reset email')
      setMessageColor('red')
    } else {
      setMessage('Password reset email sent! Be sure to check your spam folder.')
      setMessageColor('green')
    }
  }

  return (
    <>
    <MyHeader />
    <Box py={4} px={{ base: 4, md: 8 }} minHeight="90vh">
      <Center width="100%">
    <Box width="100%" maxWidth="1000px">
        <Center>
        <VStack spacing={8} mt={12} padding={8} bgColor={colors.bg.contrast} maxWidth="600px" minWidth="330px" boxShadow="lg">
      <Heading size="md">Reset Password:</Heading>
      <Input
        type="email"
        placeholder="Enter your email"
        variant="flushed"
        value={email}
        textAlign={"center"}
        fontWeight="bold"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handlePasswordReset} colorScheme="teal" width="100%">Reset Password</Button>
      {message && <Text textColor={colors.bg[messageColor]}>{message}</Text>}

        </VStack>
        </Center>
    </Box>
    </Center>
    </Box>
    <Footer />
</>
  )
  
}

export default PasswordResetRequest
