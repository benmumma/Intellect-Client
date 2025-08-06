
// CourseDetails.jsx
import React from 'react';
import { Td, VStack, HStack, Text, Button, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody } from '@chakra-ui/react';
import { useCourses } from '../../context/CoursesContext';
import CourseLevelVisualizer from '../../components/visuals/CourseLevelVisualizer';
import CourseLengthVisualizer from '../../components/visuals/CourseLengthVisualizer';

const CourseDetails = ({ course, isMobile, ...props }) => {
    const { state: courseState } = useCourses();

    return (
        <Td borderBottom="1px solid gray" {...props}>
            <VStack alignItems="flex-start">
                <CourseLengthVisualizer days={course.course_length} />
                <CourseLevelVisualizer level={course.course_level} />
                
            </VStack>
        </Td>
    );
};

export default CourseDetails;