import React, { useState, useEffect } from 'react';
import { Text, Box, VStack } from "@chakra-ui/react";
import { useIntellectInbox } from '../context/IntellectInboxContext';
import ChatBox from './ChatBox';
import TypingIndicator from '../components/visuals/TypingIndicator';

async function fetchChatMessages(supabase, sessionId) {
    const bucketName = 'ii_chats';
    const filePath = `chats/${sessionId}.json`;
    const cacheBuster = new Date().getTime();

    try {
        console.log('Fetching chat messages');
        const { data, error } = await supabase.storage
            .from(bucketName)
            .download(`${filePath}?t=${cacheBuster}`);

        if (error) {
            if (error.status !== 404 && error.status !== 400) {
                throw error;
            } else {
                return [];
            }
        }

        if (data) {
            const content = await data.text();
            return JSON.parse(content);
        }
    } catch (error) {
        throw new Error('Failed to fetch chat messages');
    }
}

const ChatDisplay = ({ supabase, lessonId, user_name }) => {
    const { inboxState, dispatch } = useIntellectInbox();
    const [loading, setLoading] = useState(true);
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        const loadMessages = async () => {
            if (lessonId > 0) {
                try {
                    const sessionId = inboxState.user_id + '-' + lessonId;
                    const messages = await fetchChatMessages(supabase, sessionId);
                    dispatch({ type: 'SET_CHAT_MESSAGES', payload: messages });
                    if (messages.length > 0) {
                        dispatch({ type: 'UPDATE_LIVE_SESSION_ID', payload: sessionId });
                    }
                } catch (error) {
                    console.error('Error loading chat messages:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadMessages();
    }, [lessonId, inboxState.user_id, dispatch, supabase]);

    useEffect(() => {
        //Scroll to the bottom of the chat display
        const chatDisplay = document.getElementById('chat-display-wrapper');
        chatDisplay.scrollTop = chatDisplay.scrollHeight;

    }, [inboxState.chat_messages.length])

    if (loading) {
        return <Text>Loading chat messages...</Text>;
    }

    return (
        <Box width="100%" padding={isMobile ? '4px':'10px'} as={VStack}>
            {inboxState.chat_messages.length === 0 ? (
                <Text>No messages yet...</Text>
            ) : (
                inboxState.chat_messages.map((msg, index) => (
                    <ChatBox key={`${msg.role}-${index}`} msg={msg} index={index} user_name={user_name} />
                ))
            )}
            {inboxState.is_typing && <TypingIndicator />}
        </Box>
    );
};

export default ChatDisplay;