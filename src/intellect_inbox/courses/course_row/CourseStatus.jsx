
// CourseStatus.jsx
import React from 'react';
import { Td, VStack, Text, ButtonGroup, Tooltip, IconButton } from '@chakra-ui/react';
import useColors from '../../theming/useColors';
import CourseProgressVisualizer from '../../components/visuals/CourseProgressVisualizer';
import { useIntellectInbox } from '../../context/IntellectInboxContext';

const CourseStatus = ({ course, isMobile, ...props }) => {
    const colors = useColors();
    const { inboxState } = useIntellectInbox();
    let course_status = course.ii_user_courses[0].status;
    let current_lesson = course.ii_user_courses[0].latest_lesson;
    let nextLessonName = null;
    if (current_lesson === 0) {
        nextLessonName = course.curriculum?.Schedule[0].Title || null;
    }
    else {
        nextLessonName = course.curriculum?.Schedule[parseInt(current_lesson)]?.Title;
    }
    let cs_text = 'Active';
    if (course_status === 1) {
        cs_text = current_lesson === course.course_length ? 'Completed!' : 'Active';
    } else if (course_status === 2) {
        cs_text = 'Paused';
    } else if (course_status === 3) {
        cs_text = 'Deleted';
    } else {
        cs_text = 'Unknown';
    }

    const lessonArray = inboxState.lesson_data.filter(lesson => lesson.course_id === course.id);

    return (
        <Td borderBottom="1px solid gray" {...props}>
            <VStack alignItems="flex-start" spacing={1}>
                <CourseProgressVisualizer course={course}course_status={cs_text}  lessonArray={lessonArray} />
                {cs_text !== 'Completed!' && <Text>Next: {nextLessonName}</Text>}
                
            </VStack>
        </Td>
    );
};

export default CourseStatus;
