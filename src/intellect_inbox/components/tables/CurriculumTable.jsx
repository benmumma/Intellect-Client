import React from 'react';
import { Box, Heading, Divider, Text, HStack, VStack } from '@chakra-ui/react';

const CurriculumTable = ({curriculum, ...props}) => {
    return (
        <Box {...props}>
                    <Heading size="md">Course Curriculum</Heading>
                    <Divider my={4} />
                    {curriculum.Schedule.map((lesson, index) => (
                        <Box key={index} maxWidth="700px">
                            <HStack width="100%">
                                <Text minWidth="50px">Day {lesson.Day}</Text>
                                <VStack width="100%" alignItems="flex-start" spacing={0}>
                                <Text fontWeight="bold">{lesson.Title}</Text>
                                <Text fontSize="sm">{lesson.Content}</Text>
                                </VStack>
                            </HStack>
                            <Divider py={2} />
                        </Box>
                        
                    ))
                }
                </Box>
    );
};

export default CurriculumTable;