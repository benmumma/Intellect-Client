import React, { useEffect, useState } from 'react';
import { Text, Textarea, Button, Divider, HStack } from "@chakra-ui/react";
import { useIntellectInbox } from '../context/IntellectInboxContext';
import { API_BASE_URL } from '../../constants/constants';

const useNewInstance = process.env.REACT_APP_USE_NEW_SUPABASE === 'true';

async function sendMessageToChatEndpoint(userId, lessonId, version, sessionId, userMessage) {
    const fetch_url = API_BASE_URL + 'intellectinbox/chat'
    console.log('SessionID:', sessionId) 
    const response = await fetch(fetch_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, lessonId, version, sessionId, userMessage, dbInstance: useNewInstance ? 'new' : 'current' }),
    });

    const data = await response.json();
    return data;
}

const ChatForm = ({lessonId, version, chatDisabled, audience}) => {
    const { inboxState, dispatch } = useIntellectInbox();
    const [userMessage, setUserMessage] = useState('');
    const [liveLessonId, setLiveLessonId] = useState(lessonId);
    let plan_message = 'Plan Activity';
    if(audience === 'For Adults' || audience === 'For Experts') {
        plan_message = 'Plan New Activity';

    }

    useEffect(() => {
        setLiveLessonId(lessonId);
        //const sessionId = inboxState.user_id + '-' + lessonId;
        //dispatch({ type: 'UPDATE_LIVE_SESSION_ID', payload: sessionId });
    }, [lessonId, inboxState.user_id, dispatch]);

    const handleSendMessage = async (message_to_send) => {
        if (!message_to_send.trim()) return;

        const newUserMessage = { role: 'user', content: message_to_send };

        // Update state and localStorage
        const updatedMessages = [...inboxState.chat_messages, newUserMessage];
        dispatch({ type: 'SET_CHAT_MESSAGES', payload: updatedMessages });
        localStorage.setItem(`chat_${inboxState.live_session_id}`, JSON.stringify(updatedMessages));
        dispatch({ type: 'SET_IS_TYPING', payload: true });
        // Clear the input box
        setUserMessage('');

        // Send message to the backend
        try {
            const response = await sendMessageToChatEndpoint(inboxState.user_id, lessonId, version, inboxState.live_session_id, message_to_send);

        if (response.error) {
            console.error(response.error);
            return;
        }
        else {
        // Append AI response to messages array
        //addMessage({ role: 'assistant', content: response.response });
        dispatch({ type: 'UPDATE_CHAT_MESSAGES', payload: [{ role: 'assistant', content: response.response.content } ]});
        dispatch({ type: 'SET_IS_TYPING', payload: false });
        }

        // Update sessionId if it was null initially
        const newAIMessage = { role: 'assistant', content: response.response.content };
            const finalUpdatedMessages = [...updatedMessages, newAIMessage];

            // Update state and localStorage with AI response
            dispatch({ type: 'SET_CHAT_MESSAGES', payload: finalUpdatedMessages });
            localStorage.setItem(`chat_${inboxState.live_session_id}`, JSON.stringify(finalUpdatedMessages));
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            dispatch({ type: 'SET_IS_TYPING', payload: false });
        }

    };


    return (
        <>
        <Divider my={2} />
        <HStack width="100%" justifyContent="center" my={1}>
            <Button width="100%" fontSize={{'base':'xs','md':'md','xl':'xs'}} colorScheme={chatDisabled ? 'gray' : 'teal'} isDisabled={chatDisabled || inboxState.is_typing} onClick={() => handleSendMessage('Summarize Lesson')}>Summarize This!</Button>
            <Button width="100%" fontSize={{'base':'xs','md':'md','xl':'xs'}} colorScheme={chatDisabled ? 'gray' : 'teal'} isDisabled={chatDisabled || inboxState.is_typing} onClick={() => handleSendMessage('Quiz Me')}>Quiz Me!</Button>
            {/*<Button width="100%" fontSize={{'base':'xs','md':'md','xl':'xs'}} colorScheme={chatDisabled ? 'gray' : 'teal'} isDisabled={chatDisabled || inboxState.is_typing} onClick={() => handleSendMessage(plan_message)}>Plan Activity!</Button>*/}
        </HStack>
            <Textarea
                placeholder={chatDisabled ? 'Chat is only available to premium users. Upgrade today!' : 'Ask the AI anything...'}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                isDisabled={chatDisabled}
                mb={2}
            />
            <Button colorScheme={chatDisabled ? 'gray' : 'teal'} isDisabled={chatDisabled || inboxState.is_typing} mb={2} onClick={() => handleSendMessage(userMessage)}>
                Send
            </Button>
        </>
    );
};

export default ChatForm;

