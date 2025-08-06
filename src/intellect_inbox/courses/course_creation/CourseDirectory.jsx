import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, VStack, Text, Box, Input, useMediaQuery, HStack } from '@chakra-ui/react';
import { useCourses } from '../../context/CoursesContext';
import DirectoryRow from '../directory_row/DirectoryRow'

const CourseDirectory = ({modFunction}) => {
    const { state: courseState } = useCourses();
    const courses_available = courseState.courses.filter(course => course.ii_user_courses.length === 0 && course.is_listed === true);
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const [searchQuery, setSearchQuery] = useState("");


    const filteredCourses = courses_available.filter(course => {
        const textString = course.display_name + course.course_description + course.language + course.course_subject + course.tags + course.teacher_persona;
        return (textString.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    );

    return (
        <Box>
            <Input
                placeholder="Search courses"
                value={searchQuery}
                variant="filled"
                size="lg"
                boxShadow="md"
                onChange={(e) => setSearchQuery(e.target.value)}
                mb={4}
            />
            <HStack>
                {/* Filters to go here */}
            </HStack>
            <Box maxHeight="400px" overflowY="scroll">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            {!isMobile && (
                                <>
                                    <Th>Course Name</Th>
                                    <Th>Instructor</Th>
                                    <Th>
                                        <VStack alignItems="flex-start">
                                            <Text>Length</Text>
                                            <Text>Level</Text>
                                        </VStack>
                                    </Th>
                                </>
                            )}
                            {isMobile && <Th>Course</Th>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredCourses.map((course, index) => (
                            <DirectoryRow key={index} course={course} modFunction={modFunction} />
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default CourseDirectory;
