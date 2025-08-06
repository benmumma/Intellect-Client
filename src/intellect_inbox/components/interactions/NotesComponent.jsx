import React, { useState, useEffect } from 'react';
import { Box, Text, Textarea, Button, useColorModeValue } from '@chakra-ui/react';
import { update_ii_user_post } from '../../api/ii_user_posts';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import useColors from '../../theming/useColors';

const NotesComponent = ({user_id, post_id, notes, ...props}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [myNotes, setMyNotes] = useState(notes === null ? '' : notes);
    const colors = useColors();
    const { inboxState, dispatch } = useIntellectInbox();
    const notesBgColor = useColorModeValue('forwardWhite.300', 'teal.800');
    const writtenNotesBgColor = useColorModeValue('forwardWhite.400', 'teal.600'); 

    useEffect(() => {
        setMyNotes(notes === null ? '' : notes);
    }
    , [notes]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateClick = async () => {
        // Call the function to update notes in the database


        const data_to_update = {
            user_id: user_id,
            post_id: post_id,
            notes: myNotes
        }
        const { result, message } = await update_ii_user_post(data_to_update);
        dispatch({ type: 'UPDATE_NOTES', payload: { post_id:post_id, user_id:user_id, notes: myNotes } });
        if (result === 'error') {
            console.error('Error updating flag:', message);
            setMyNotes(notes);
        }
        else {
            console.log('Read updated:', message);
            setIsEditing(false);
        }
    };

    const handleNotesChange = (event) => {
        setMyNotes(event.target.value);
    };

    return (
        <Box {...props}>
            {isEditing ? (
                <Textarea value={myNotes} onChange={handleNotesChange} />
            ) : (
                <Text cursor="pointer" 
                onClick={() => handleEditClick()} 
                backgroundColor={myNotes === '' ? colors.bg.contrast : colors.bg.darker} 
                textColor = {myNotes === '' ? colors.text.context : colors.text.main}
                p={2} >
                    {myNotes === '' ? 'Add Notes' : myNotes}
                </Text>
            )}

            {isEditing && (
                <Button onClick={handleUpdateClick}>Update</Button>
            )}
        </Box>
    );
};

export default NotesComponent;