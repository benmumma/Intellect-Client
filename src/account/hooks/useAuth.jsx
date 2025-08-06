import React, { useState, } from 'react';
import { useToast } from '@chakra-ui/react';
import {  ii_supabase } from '../../constants/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useIntellectInbox } from '../../intellect_inbox/context/IntellectInboxContext';

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const {inboxState, dispatch:inboxDispatch} = useIntellectInbox();

    const toast = useToast();
    const navigate = useNavigate();

    const signInWithOtp = async (email, app_name = null) => {
        setLoading(true);
        //const supabaseClient = isIntellectInbox ? ii_supabase : supabase;
        let supabaseClient = null;
        let redirectUrl = null
        if (app_name === 'intellectinbox') {
            supabaseClient = ii_supabase;
            redirectUrl = 'https://www.intellect.email/setpassword/intellectinbox';
        }
        else {
            //Throw error
            console.error('Error signing in:', 'App name not provided');
        }


        const { user, error } = await supabaseClient.auth.signInWithOtp({ 
          email,
          options: {
            emailRedirectTo: redirectUrl
          }
         });
    
        if (error) {
          console.error('Error signing in:', error);
          toast({
            title: "Error",
            description: 'Error signing up - please check back soon!',
            status: "error",
            position: 'top',
            isClosable: true,
          });
        } else {
          
          toast({
            title: "Check your inbox!",
            description: "We've sent you a sign-in link to your email address!",
            status: "success",
            position: 'top',
            isClosable: true,
          });
        }
        setLoading(false);
        // If user is not returned immediately, listen for an auth event
        const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
              // After a successful sign in, call the createUser function.
              console.log('Initializing II Account');
              //createUser(session.user);
              setLoading(false);
              authListener.unsubscribe(); // Dispose of the listener after the user is created
            }
          });

        return { user, error };
      };

      const signOut = async (app_name = null) => {
        setLoading(true);
        let supabaseClient = null;
        if (app_name === 'intellectinbox') {
            supabaseClient = ii_supabase;
        }
        else {
            //Throw error
            console.error('Error signing in:', 'App name not provided');
        }

        const { error } = await supabaseClient.auth.signOut();
    
        if (!error) {
            if(app_name === 'intellectinbox') {

                inboxDispatch({ type: 'INBOX_SIGN_OUT' });
                toast({
                    title: "Signed Out",
                    description: "You have been signed out of Intellect Inbox.",
                    status: "success",
                    position: 'top',
                    isClosable: true,
                });
            }
          //isIntellectInbox ? dispatchInbox({ type: 'INBOX_SIGN_OUT' }) : dispatchForward({ type: 'FORWARD_SIGN_OUT' });
        } else {
          console.error('Error signing out:', error.message);
        }
        setLoading(false);
      };

      const loginWithPassword = async ( email, password,app_name=null, redirect_url=null) => {
        setLoading(true);
        let supabaseClient = null;
        if (app_name === 'intellectinbox') {
            supabaseClient = ii_supabase;
        }
        else {
            //Throw error
            console.error('Error signing in:', 'App name not provided');
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
        });
    
        if (error) {
          //window.alert(error.error_description || error.message)
            toast({
                title: "Error",
                description: error.error_description || error.message,
                status: "error",
                position: 'top',
                isClosable: true,
            });
        } else {
          if(redirect_url) {
            navigate(redirect_url)
          }
          else {
            if(app_name === 'intellectinbox') {
                navigate('/intellectinbox')
            }
          }
        }
        setLoading(false)
        return { data, error };

    }
    
      return { signInWithOtp, signOut, loginWithPassword, loading };
    };

export default useAuth;