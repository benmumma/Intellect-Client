import React, { useState, useEffect } from 'react';
import { ii_supabase } from '../../constants/supabaseClient';
import { Box, Input, Button, useToast, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useIntellectInbox } from '../../intellect_inbox/context/IntellectInboxContext';
import { upsert_ii_user } from '../../intellect_inbox/api/ii_users';
import { format_dow_schedule } from '../../intellect_inbox/helpers/reception_days';

export default function PasswordSetter({app}) {
    const toast = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidPass, setIsValidPass] = useState(false);
    const navigate = useNavigate();
    const {inboxState, dispatch} = useIntellectInbox();
    const [isReadyToNavigate, setIsReadyToNavigate] = useState(false);


    console.log(app);

    useEffect(() => {
        if (isReadyToNavigate) {
            console.log('Navigating to intellectinbox');
            navigate('/intellectinbox');
        }
    }, [isReadyToNavigate]);



    //Handle PasswordValidation
    useEffect(() => {
        if(password.length >= 6 && password === confirmPassword) {
                setIsValidPass(true);
        }
        else {
                setIsValidPass(false);
        }
    },[password,confirmPassword])

    const handlePasswordSet = async () => {
        const new_password = password;
        try { 
            let response;
            if (app==='intellectinbox') {
                response =  await ii_supabase.auth.updateUser({password: new_password})

                //Set has_set_password to true
                const new_data_to_send = {
                    user_id: inboxState.user_id, 
                    has_set_password: true, 
                    email_address: inboxState.email_address,
                    user_tier: 'free',
                }
                //
                if(inboxState.user_name === null || inboxState.user_name === '') {
                    new_data_to_send.user_name = 'Anonymous';
                }
                if(inboxState.current_subject === null || inboxState.current_subject === '') {
                    new_data_to_send.current_subject = 123;
                }
                if(inboxState.current_audience === null || inboxState.current_audience === '') {
                    new_data_to_send.current_audience = 3;
                }
                if(inboxState.timezone === null || inboxState.timezone === '') {
                    new_data_to_send.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                }
                if(inboxState.reception_time === null || inboxState.reception_time === '') {
                    new_data_to_send.reception_time = '7';
                }
                if(inboxState.dow_schedule === null || Object.keys(inboxState.dow_schedule).length === 0) {
                    new_data_to_send.dow_schedule = format_dow_schedule(['Mon','Wed','Fri'],null);
                }


                
                const { data, error } = await upsert_ii_user(new_data_to_send);
                if (error) {
                    console.error('Failed to update user:', error);
                }
                dispatch({
                    type: 'UPDATE_STATE',
                    payload: new_data_to_send
                });
                // Mark as ready to navigate
                setIsReadyToNavigate(true);
                
            }
            if (response.error) {
                toast({
                    title: "Error",
                    description: response.error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }
            else {
                toast({
                    title: "Password Set!",
                    description: "Welcome to Intellect Inbox!",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                console.log('Navigating to intellectinbox')

            }
        }
        catch (error) {
                console.error('Failed to update user:', error);
        }
    }

    return (
        <>
        <Box as="form" onSubmit={handlePasswordSet} m={4}>
            <Box textAlign="center" fontSize="md" fontWeight="bold" m={2}>Please set a password!</Box>
            <Input 
                type="password" 
                placeholder="Set a Password"
                required
                value={password || ''}
                onChange={(e) => setPassword(e.target.value)}
                m={2}
                borderRadius={0}
            />
            <Input 
                type="password" 
                placeholder="Confirm your Password"
                required
                value={confirmPassword || ''}
                onChange={(e) => setConfirmPassword(e.target.value)}
                m={2}
                borderRadius={0}
            />
            <Text fontSize="sm" m={2} color={isValidPass ? 'green' : 'red' }>{'Passwords must match and be at least 6 characters long'}</Text>
            <Button width="100%" colorScheme="teal" isDisabled={!isValidPass} onClick={() => handlePasswordSet()} m={2} borderRadius={0}>Set Password</Button>
        </Box>
        </>
    )
}
