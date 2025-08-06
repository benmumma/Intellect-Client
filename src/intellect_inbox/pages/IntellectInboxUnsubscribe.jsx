import React, { useState, useEffect } from 'react';
import { Box, Text, Input, Textarea, Button, useToast , Center} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { ii_supabase } from '../../constants/supabaseClient';
import {jwtDecode} from "jwt-decode";

const IntellectInboxUnsubscribe = () => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const location = useLocation();
  const toast = useToast();

  // Extract and decode token from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    try {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
    } catch (error) {
      toast({
        title: 'Invalid or expired link',
        description: "Please check your link and try again.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [location, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation example
    if (!email) {
      toast({
        title: 'Error',
        description: 'Email is required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    // Example Supabase initialization
    // Ensure you've initialized Supabase client somewhere in your app
    const { data: userData, error: userError } = await ii_supabase
      .from('ii_users')
      .select('user_id')
      .eq('email_address', email)
      .single(); // Assuming email is unique and always finds one user
  
    if (userError || !userData) {
      toast({
        title: 'Error',
        description: 'User not found.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    const { error: insertError } = await ii_supabase
      .from('ii_user_unsubscribed')
      .insert([
        { user_id: userData.user_id, reason: reason },
      ]);
  
    if (insertError) {
      toast({
        title: 'Error',
        description: 'Failed to unsubscribe.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Unsubscribed',
        description: 'You have been successfully unsubscribed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Optionally redirect the user or clear the form
    }
  };
  

  return (
    <Center width="100%"  p={10}>
    <Box maxWidth="600px">
      <Text mb={4}>We're sorry to see you go. Please let us know why you're unsubscribing:</Text>
      <Input value={email} isReadOnly placeholder="Your email address" mb={4} />
      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for unsubscribing (optional)"
        mb={4}
      />
      <Button colorScheme="red" onClick={handleSubmit}>Unsubscribe</Button>
    </Box>
    </Center>
  );
};

export default IntellectInboxUnsubscribe;
