import React from 'react';
import { Box, Flex, Tooltip, HStack, Text, VStack, Icon } from '@chakra-ui/react';
import { AiOutlineClockCircle } from 'react-icons/ai';

// Utility function to convert days to weeks and partial weeks
const convertDaysToWeeks = (days) => {
  const weeks = Math.floor(days / 7);
  const partialWeek = (days % 7) / 7;
  return { weeks, partialWeek };
};

const CourseLengthVisualizer = ({ days }) => {
  const { weeks, partialWeek } = convertDaysToWeeks(days);

  // Create an array representing the filled and partial weeks
  const weekArray = Array.from({ length: 5 }, (_, index) => {
    if (index < weeks) {
      return 1; // Full week
    } else if (index === weeks && partialWeek > 0) {
      return partialWeek; // Partial week
    } else {
      return 0; // Empty week
    }
  });

  return (
    <HStack spacing={2}>
      <Icon as={AiOutlineClockCircle} boxSize={6} marginRight="8px" color="gray.500" />
      <Tooltip label={`${days} days`} aria-label="Course length in days">
      <Flex>
        {weekArray.map((week, index) => (
            <Box
              key={index}
              width="20px"
              height="10px"
              margin="2px"
              backgroundColor={week === 1 ? 'teal.500' : week > 0 ? 'teal.300' : 'gray.200'}
              opacity={week > 0 ? week : 1}
              borderRadius="6px"
              transition="transform 0.2s"
              boxShadow="sm"
              _hover={{ transform: 'scale(1.1)', cursor: 'pointer' }}
            />
        ))}
      </Flex>
      </Tooltip>
    </HStack>
  );
};

export default CourseLengthVisualizer;
