import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, HStack, Select, useColorModeValue, ButtonGroup, Button, useMediaQuery } from '@chakra-ui/react';
import CourseSelector from '../course_creation/CourseSelector';
import ActiveCourseTable from './ActiveCourseTable';
import { useCourses } from '../../context/CoursesContext';
import { arch } from 'os';

const CourseSection = () => {

    const { state: courseState, dispatch: coursesDispatch } = useCourses();
    const [courseView, setCourseView] = useState('active');
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const [isMobile] = useMediaQuery("(max-width: 48em)");

    const coursesToShow = courseState.courses;
    const courseCounts = {
        active: coursesToShow.filter(course => course.ii_user_courses[0]?.status === 1 && course.ii_user_courses[0].latest_lesson < course.course_length).length,
        paused: coursesToShow.filter(course => course.ii_user_courses[0]?.status === 2).length,
        completed: coursesToShow.filter(course => course.ii_user_courses[0]?.status === 1 && course.ii_user_courses[0].latest_lesson >= course.course_length).length,
        archived: coursesToShow.filter(course => course.ii_user_courses[0]?.status === 3).length
    }

    const handleSetCourseView = (e) => {
        setCourseView(e.target.value);
    }





    return (
        <Box p={4} bg={bgColor} borderRadius="md" width="100%" m={2}>
            <HStack justifyContent="space-between">
                <HStack width="100%" flex="1">
                    <Heading flex="2" as="h2" size={isMobile ? 'md' : 'lg'} mb={2}>
                        My Courses
                    </Heading>
                    {!isMobile && <ButtonGroup>
                        <Button size="sm" colorScheme="teal" 
                                variant={courseView === 'active'? "solid": "ghost"} 
                                _hover={{ textDecoration: 'underline' }} 
                                onClick={() => setCourseView('active')}>Active ({courseCounts.active+1})</Button>
                        <Button size="sm" colorScheme="teal" 
                                variant={courseView === 'paused'? "solid": "ghost"} 
                                _hover={{ textDecoration: 'underline' }} 
                                onClick={() => setCourseView('paused')}>Paused ({courseCounts.paused})</Button>
                        <Button size="sm" colorScheme="teal" 
                                variant={courseView === 'completed'? "solid": "ghost"} 
                                _hover={{ textDecoration: 'underline' }} 
                                onClick={() => setCourseView('completed')}>Completed ({courseCounts.completed})</Button>
                        <Button size="sm" colorScheme="teal" 
                                variant={courseView === 'archived'? "solid" : "ghost"} 
                                _hover={{ textDecoration: 'underline' }} 
                                onClick={() => setCourseView('archived')}>Archived ({courseCounts.archived})</Button>
                    </ButtonGroup>}
                    {isMobile && <>
                        <Select flex="2" value={courseView} onChange={handleSetCourseView}>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                    </Select>
                    </>}
                </HStack>
                <CourseSelector />
            </HStack>
            <ActiveCourseTable courses={coursesToShow} view={courseView} />
        </Box>
    );
};

export default CourseSection;