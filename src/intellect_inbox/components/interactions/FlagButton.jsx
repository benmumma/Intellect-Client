import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { AiFillFlag } from 'react-icons/ai';
import { update_ii_user_post } from '../../api/ii_user_posts';
import { useIntellectInbox } from '../../context/IntellectInboxContext';

const FlagButton = ({ user_id, post_id, is_flagged }) => {
    const [flagged, setFlagged] = useState(is_flagged);
    const { inboxState, dispatch } = useIntellectInbox();

    useEffect(() => {
        setFlagged(is_flagged);
    }, [is_flagged]);

    const handleClick = async () => {
        const updatedFlagged = !flagged;
        setFlagged(updatedFlagged);
        //handleFlagToggle(flagId, updatedFlagged);
        const data_to_update = {
            user_id: user_id,
            post_id: post_id,
            is_flagged: updatedFlagged
        }
        const { result, message } = await update_ii_user_post(data_to_update);
        //Update the state of inboxState
        dispatch({ type: 'UPDATE_FLAG', payload: { post_id:post_id, user_id:user_id, is_flagged: updatedFlagged } });

        if (result === 'error') {
            console.error('Error updating flag:', message);
            setFlagged(!updatedFlagged);
        }
        else {
            console.log('Flag updated:', message);
        }


    };

    return (
        <Tooltip label="Flagged">
            <IconButton
                onClick={() => handleClick()}
                icon={<AiFillFlag />}
                variant="ghost"
                color={flagged ? 'red' : 'gray'}
            />
        </Tooltip>
    );
};

export default FlagButton;