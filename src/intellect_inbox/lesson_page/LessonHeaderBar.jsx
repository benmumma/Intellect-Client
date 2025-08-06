import React, {useState, useEffect} from 'react';
import { Box, Flex, Text, HStack, Button, Heading, VStack} from '@chakra-ui/react';
import { useIntellectInbox } from '../context/IntellectInboxContext';
import { AiFillPauseCircle, AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import c from '../../constants/uiConstants.js';
import { Link as ReachLink, useNavigate } from 'react-router-dom';
import AdHocLessonButton from '../components/buttons/AdHocLessonButton.jsx';
import { useCourses } from '../context/CoursesContext.jsx';

const LessonHeaderBar = ({ lesson, setLesson }) => {
    const { inboxState, dispatch } = useIntellectInbox();
    const isMobile = window.innerWidth < 768;
    const {state: coursesState} = useCourses();
    //console.log(lesson);
    const navigate = useNavigate();
    const lessonIndex = inboxState.lesson_data.findIndex(allLesson => lesson.id === parseInt(allLesson.id));
    const lessonCount = inboxState.lesson_data.length;

    const lessonMover = (direction) => {
        let currentLessonIndex = inboxState.lesson_data.findIndex(allLesson => lesson.id === parseInt(allLesson.id));
        //console.log(currentLessonIndex);
        if (currentLessonIndex === 0 && direction === 1) return;
        if (currentLessonIndex === inboxState.lesson_data.length - 1 && direction === -1) return;
        let newLessonIndex = currentLessonIndex - direction;
        //console.log(newLessonIndex);
        const url = `/intellectinbox/lesson/${inboxState.lesson_data[newLessonIndex].id}`;
        //console.log(url);

        navigate(url);
    }

    const buttonText = isMobile ? '+' : 'New Lesson!';

    const courseName = coursesState.courses.find(course => course.id === lesson.course_id)?.course_subject || '';
    const displayName = coursesState.courses.find(course => course.id === lesson.course_id)?.display_name || '';
    const realDisplay = displayName === '' ? courseName : displayName;


    return (
        <Flex justifyContent="space-between" alignItems="center" p={4} bg="teal.500" width="100%" position="sticky" zIndex="100" top="0">
            <Button as={ReachLink} to="/intellectinbox" color="white" variant="ghost"><AiOutlineArrowLeft /><Text>&nbsp;Home</Text></Button>
            <HStack>
                <Button color="white" variant="ghost" onClick={() => lessonMover(-1)} display={lessonIndex === lessonCount-1 ? 'none':'flex'}><AiOutlineArrowLeft /><Text display={{'base':'none','lg':'flex'}}>&nbsp;Prev</Text></Button>
            <VStack spacing={1}>
            <Heading size={{'base':'sm','lg':'md'}} color="white" overflow="clip" maxHeight="40px">{lesson.post_name}</Heading>
            {lesson.course_id === null && <Text color="white"  overflow="clip" maxHeight="40px" fontSize={{'base':'xs','lg':'md'}}>{lesson.subject_name} {lesson.audience_name}</Text>}
            {lesson.course_id !== null && <Text color="white"  overflow="clip" maxHeight="40px" fontSize={{'base':'xs','lg':'md'}}>{realDisplay}</Text>}
            </VStack>
            <Button color="white" variant="ghost" onClick={() => lessonMover(1)}  display={lessonIndex === 0 ? 'none':'flex'}><Text display={{'base':'none','lg':'flex'}}>Next&nbsp;</Text><AiOutlineArrowRight /></Button>
            </HStack>
            <HStack>
                <AdHocLessonButton buttonText={buttonText} />
            </HStack>
            
        </Flex>
    );
};

export default LessonHeaderBar;