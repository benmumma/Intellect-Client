import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { API_BASE_URL } from '../../constants/constants';
import { useIntellectInbox } from '../context/IntellectInboxContext';

const useNewInstance = process.env.REACT_APP_USE_NEW_SUPABASE === 'true';

const HighlightMenu = ({lessonId, thisLesson}) => {
    const { inboxState, dispatch } = useIntellectInbox();
    const [isMenuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');


  const handleAiGeneration = async (option_selected) => {
    let message_to_send = '';
    if (option_selected === 'ELI5') {
        message_to_send = `Explain "${selectedText}" like I'm 5 years old.`
    }
    else if (option_selected === 'Defi') {
        message_to_send = `Define "${selectedText}".`;
    }
    else if (option_selected === 'More') {
        message_to_send = `Tell me more about "${selectedText}".`;
    }
    dispatch({ type: 'UPDATE_CHAT_MESSAGES', payload: [{ role: 'user', content: message_to_send }] });
    dispatch({ type: 'SET_IS_TYPING', payload: true });
    console.log('Option Selected:', option_selected);
    // Create data to send to API endpoint
    const data_to_send = {
      userId:inboxState.user_id,
      lessonId:lessonId,
      sessionId:inboxState.live_session_id,
      version:thisLesson.version,
      userMessage:'z'+option_selected+'_'+selectedText,
      dbInstance: useNewInstance ? 'new' : 'current',
    };
    try {
    const send_url = API_BASE_URL+'intellectinbox/chat'
    // Call the API endpoint
    console.log('Data to send:', data_to_send)
      const response = await fetch(send_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers here
        },
        body: JSON.stringify(data_to_send),
        // You might need to include credentials: 'include' if your backend requires authentication
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
    // Handle the response -> add it to the user's chat
    if (response.error) {
        console.error(response.error);
        return;
    }
    else {
    // Append AI response to messages array
    //addMessage({ role: 'assistant', content: response.response });
    dispatch({ type: 'UPDATE_CHAT_MESSAGES', payload: [{ role: 'assistant', content: data.response.content } ]});
    dispatch({ type: 'SET_IS_TYPING', payload: false });
    }


    } 
    catch (error) {
        console.error('Error:', error);
        }


  }

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setMenuPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX });
      setMenuVisible(true);
      setSelectedText(selection.toString())
    } else {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

return (
    <Box position="relative">
        <Box ref={menuButtonRef}>
        </Box>
        {isMenuVisible && (
            <Portal>
                <Box
                    position="absolute"
                    top={`${menuPosition.top+25}px`}
                    left={`${menuPosition.left}px`}
                    zIndex="tooltip"
                >
                    <Menu isOpen={true}>
                        <MenuButton as={Box} />
                        <MenuList>
                            <MenuItem isDisabled={true} bgColor="teal.100" textColor="black !important">{selectedText.length > 25 ? selectedText.substring(0, 24)+'...' : selectedText}</MenuItem>
                            <MenuItem onClick={() => handleAiGeneration('ELI5')}>ELI5</MenuItem>
                            <MenuItem onClick={() => handleAiGeneration('Defi')}>Define This</MenuItem>
                            <MenuItem onClick={() => handleAiGeneration('More')}>Tell me More</MenuItem>
                            {/*<MenuItem onClick={() => handleAiGeneration('Less')}>Create a Lesson</MenuItem>*/}
                        </MenuList>
                    </Menu>
                </Box>
            </Portal>
        )}
    </Box>
);
};

export default HighlightMenu;
