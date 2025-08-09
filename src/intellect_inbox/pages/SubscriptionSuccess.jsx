import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ii_supabase } from '../../constants/supabaseClient';
import MyHeader from '../../general/components/MyHeader';
import Footer from '../../general/components/Footer';
// DEPRECATED: Subscription success is handled by centralized Mumapps-Auth. This page remains for archival only.
import { Box, Text, Link } from '@chakra-ui/react';
import { MANAGE_ACCOUNT_URL } from '../../constants/constants';

const SubscriptionSuccess = () => {
  const [status, setStatus] = useState('loading');
  const location = useLocation();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');
      if (!sessionId) {
        setStatus('error');
        return;
      }

      // Check subscription status in your database
      const { data: profile, error } = await ii_supabase
        .from('ii_users')
        .select('subscription_status')
        .single();

      if (error) {
        console.error('Error fetching subscription status:', error);
        setStatus('error');
      } else if (profile.subscription_status === 'active') {
        setStatus('success');
      } else {
        setStatus('pending');
      }
    };

    checkSubscriptionStatus();
  }, [location]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>There was an error processing your subscription. Please contact support.</div>;
  }

  if (status === 'pending') {
    return <div>Your subscription is being processed. Please check back in a few moments.</div>;
  }

  return (
    <>
    <MyHeader />
    <Box bg="yellow.50" border="1px solid" borderColor="yellow.200" p={4} borderRadius="md" m={4}>
      <Text fontWeight="bold">This page has moved</Text>
      <Text>Subscription confirmations and billing are now handled in our centralized portal.</Text>
      <Link href={MANAGE_ACCOUNT_URL} isExternal color="teal.500">Open Manage Account</Link>
    </Box>
    <div>
      <h1>Subscription Successful!</h1>
      <p>Thank you for subscribing. Your premium features are now active!</p>
      <a href="/">Return to home</a>
    </div>
    <Footer />
    </>
  );
};

export default SubscriptionSuccess;