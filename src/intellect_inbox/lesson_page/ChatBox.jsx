
import React, { useState, useEffect } from 'react';
import { Text, Divider, Box, Mark } from "@chakra-ui/react";
import Markdown from 'react-markdown';
import MarkdownRenderer from './MarkdownRenderer';

const ChatBox = React.memo(({msg, index, user_name}) => {
    const isAI = msg.role === 'assistant';
    // Find and replace Rumpelstiltskin with the user's name
    const replacedContent = msg.content.replace(/Rumpelstiltskin/g, user_name);
    const isMobile = window.innerWidth < 768;
    let sharedContent = '';

    if(!isAI){
        if(replacedContent === 'Summarize Lesson') {
            sharedContent = 'Summarize It!'
        }
        else if(replacedContent === 'Quiz Me') {
            sharedContent = 'Quiz Me!'

        }
        else if(replacedContent === 'Plan Activity') {
            sharedContent = 'Plan Activity!'
        }
        else if(replacedContent === 'Plan New Activity') {
            sharedContent = 'Plan An Activity!'
        }
        else {
            sharedContent = replacedContent;
        }

    }
    else {
        sharedContent = replacedContent;
    }

    let width = '50%';

    if(isAI) {
        isMobile ? width = '90%' : width = '80%';
    }
    else {
        isMobile ? width = '80%' : width = '50%';
    
    }


return (
    <Box 
    py={isMobile ? 4 : 4} 
    px={isMobile ? 4 : 8}
    key={index} 
    mb={2}
    boxShadow="md"
    borderRadius="5px"
    bgColor={isAI ? 'teal.100' : 'blue.300'}
    width={width}
    alignSelf={isAI ? 'flex-start' : 'flex-end'}
    style={{ textAlign: msg.role === 'user' ? 'left' : 'left' }}>
                        <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                        <MarkdownRenderer content={sharedContent} />
                    </Box>
);


});

export default ChatBox;