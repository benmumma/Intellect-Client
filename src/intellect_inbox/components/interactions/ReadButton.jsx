import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import { useUserLessons } from '../../actions/useUserPosts';
import debounce from 'lodash.debounce';

const ReadButton = ({ user_id, post_id, is_read }) => {
    const [read, setRead] = useState(is_read);
    const { inboxState, dispatch } = useIntellectInbox();
    const { completeLesson } = useUserLessons();

    useEffect(() => {
        setRead(is_read);
    }, [is_read]);

    // Debounce the handleClick function to prevent multiple rapid invocations
    const handleClick = debounce(async () => {
        const updatedRead = !read;
        setRead(updatedRead);
        completeLesson({ post_id, is_read: updatedRead });
    }, 300);

    return (
        <Tooltip label="Read">
            <IconButton
                onClick={handleClick}
                icon={<AiFillCheckCircle />}
                variant={read ? "solid" : "ghost"}
                colorScheme={read ? 'green' : 'gray'}
                color={read ? 'green' : 'gray'}
            />
        </Tooltip>
    );
};

export default ReadButton;
