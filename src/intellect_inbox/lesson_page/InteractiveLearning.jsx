import React from 'react';
import { Box, Heading, Text } from "@chakra-ui/react";
import ChatDisplay from "./ChatDisplay";
import ChatForm from "./ChatForm";
import { ii_supabase } from "../../constants/supabaseClient";
import { useIntellectInbox } from "../context/IntellectInboxContext";


const InteractiveLearning = ({thisLesson, audience}) => {
    const {inboxState} = useIntellectInbox();
    const chatDisabled = inboxState.user_tier === 'standard' ? true : false;
    const isMobile = window.innerWidth < 768;

return (
    <Box my={4} 
        id="chat-display-wrapper"
        width="100%" 
        border='1px solid #ccc' 
        padding={isMobile ? 2 : 4}
        boxShadow="lg" 
        borderRadius="5px" 
        bgColor="forwardWhite.100" 
        flex={1}  
        position="sticky" 
        zIndex={{'base':'0','xl':'100'}}
        top={{'base':'','xl':'100px'}} 
        overflowY={{'base':'auto','xl':'scroll'}}
        maxHeight={{'base':'','xl':'80vh'}}>
            <Heading as="h2" size="md">Interactive Learning</Heading>
            <Text fontStyle="oblique" size="sm">{chatDisabled ? 'Upgrade to Premium to use lesson chat!' : 'Use our fast actions or ask the AI anything about the lesson in the box below!'}</Text>
        <ChatDisplay supabase={ii_supabase} lessonId = {thisLesson.id} user_name={inboxState.user_name} />
        <ChatForm lessonId = {thisLesson.id} version={thisLesson.version} chatDisabled={chatDisabled} audience={audience} />
        </Box>
)

}

export default InteractiveLearning;