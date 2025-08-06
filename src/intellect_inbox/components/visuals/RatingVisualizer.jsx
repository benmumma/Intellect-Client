import React from 'react';
import { Box, Flex, Icon, Text, Tooltip } from "@chakra-ui/react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const RatingVisualizer = ({ total_rating, total_reviews }) => {
    const averageRating = total_rating / total_reviews;

    const renderStar = (index) => {
        if (index < Math.floor(averageRating)) {
            return <Icon as={FaStar} color="yellow.500" />;
        } else if (index === Math.floor(averageRating) && averageRating % 1 > 0) {
            return <Icon as={FaStarHalfAlt} color="yellow.500" />;
        } else {
            return <Icon as={FaStar} color="gray.300" />;
        }
    };

    return (
        <Tooltip label={`${averageRating.toFixed(1)} rating, ${total_reviews} reviews`} aria-label="A tooltip">
        <Flex align="center" alignItems="flex-start">
            {[...Array(5)].map((_, index) => (
                
                    <Box>{renderStar(index)}</Box>
                
            ))}
            <Text ml={2}>({total_reviews || 0})</Text>
        </Flex>
        </Tooltip>
    );
};

export default RatingVisualizer;