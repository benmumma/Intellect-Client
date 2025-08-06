import React from 'react';
import { Box, Button, Icon, HStack } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import debounce from 'lodash.debounce';

const RatingButton = React.memo(({ postId, currentRating, updateRating }) => {
    const handleUpdateClick = debounce((rating) => {
        updateRating(postId, rating);
    }, 300);

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Icon
                as={FaStar}
                key={i}
                boxSize="1.5em"
                color={i <= currentRating ? 'yellow.400' : 'gray.300'}
                onClick={() => handleUpdateClick(i)}
                cursor="pointer"
                _hover={{ color: 'yellow.500' }}
            />
        );
    }

    return (
        <HStack spacing={0}>
            {stars}
        </HStack>
    );
});

export default RatingButton;
