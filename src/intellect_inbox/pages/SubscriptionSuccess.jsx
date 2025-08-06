import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ii_supabase } from '../../constants/supabaseClient';
import MyHeader from '../../general/components/MyHeader';
import Footer from '../../general/components/Footer';

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