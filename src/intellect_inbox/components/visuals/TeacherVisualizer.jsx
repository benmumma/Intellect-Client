import React from 'react';
import { Box, Text, VStack, Image, Tooltip} from '@chakra-ui/react';

const TeacherVisualizer = ({teacher_data, custom_override=null}) => {
    //console.log(teacher_data);
    if(teacher_data === null) {
        return (
            <Tooltip label="No teacher information available">
            <Box as={VStack} spacing={0}>
                <Text>Taught by:</Text>
                <Text fontSize="xl" fontWeight="bold">Unknown</Text>
            </Box>
            </Tooltip>
        );
    }

    if(teacher_data.image_url === null) {
    return (
        <Tooltip label={teacher_data.description || custom_override}>
        <Box as={VStack} spacing={0}>
            <Text>Taught by:</Text>
            <Text fontSize="xl" fontWeight="bold">{teacher_data.name}</Text>
        </Box>
        </Tooltip>
    );
    }
    else {
        return (
            <Tooltip label={teacher_data.description || custom_override}>
            <Box as={VStack} spacing={0}>
                <Image src={teacher_data.image_url} alt={teacher_data.name} boxSize="75px" minWidth="75px" />
                <Text fontSize="xs" fontWeight="bold">{teacher_data.name}</Text>
            </Box>
            </Tooltip>
            
        );
    }
};

export default TeacherVisualizer;