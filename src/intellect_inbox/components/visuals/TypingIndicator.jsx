import React from 'react';
import { Box, Text, HStack, Spinner } from "@chakra-ui/react";

const TypingIndicator = () => {
    return (
        <Box
            bg="teal.50"
            borderRadius="lg"
            padding="10px"
            maxWidth="60%"
            alignSelf="flex-start"
            boxShadow="md"
            my="10px"
        >
            <HStack>
                <Spinner size="md" speed='1s' color="teal.500" />
                <Text color="teal.800">AI is typing...</Text>
            </HStack>
        </Box>
    );
};

export default TypingIndicator;
