import React from 'react';
import { Box, Flex, Tooltip, HStack } from '@chakra-ui/react';
import useColors from '../../theming/useColors';
import { useNavigate } from 'react-router-dom';

// Utility function to determine the color based on course status

const CourseProgressVisualizer = ({ course, course_status, lessonArray }) => {
  //console.log(course);
  const navigate = useNavigate();
  const current_lesson = course.ii_user_courses[0].latest_lesson;
  const course_length = course.course_length;
  const numberArray = Array.from({ length: course_length }, (_, index) => index + 1);
  const colors = useColors();

  const getColorForStatus = (status, isRead, isPastLesson, isNextLesson) => {
    if (!isPastLesson && !isNextLesson) {
      return colors.text.inactive;
    }
    if(isNextLesson) {
      return colors.text.teal;
    }
    switch (status) {
      case 'Completed!':
        return isRead ? colors.text.success : colors.text.warning;
      case 'Active':
        return isRead ? colors.text.success : colors.text.warning;
      case 'Paused':
        return isRead ? colors.text.success : colors.text.warning;
      case 'Deleted':
        return isRead ? colors.text.success : colors.text.warning;
      default:
        return 'gray.200';
    }
  };

  const handleNavClick = (lesson_id) => {
    console.log('Navigating to lesson:', lesson_id);
    navigate(`/intellectinbox/lesson/${lesson_id}`);
  };

  return (
    <HStack spacing={0.5} width="100%">
      {numberArray.map((n) => {
        const isPastLesson = n <= current_lesson;
        const isNextLesson = n === current_lesson + 1;
        const isRead = lessonArray.find((lesson) => lesson.order_id === n)?.is_read;
        const color = getColorForStatus(course_status,isRead, isPastLesson, isNextLesson);
        const lesson_name = isPastLesson ? (': '+lessonArray?.find((lesson) => lesson.order_id === n)?.post_name) : '';
        return (
          <Tooltip label={`Lesson ${n}${lesson_name}`} key={n} aria-label={`Lesson ${n}${lesson_name}`}>
            <Box
              borderWidth={isNextLesson ? '2px' : '0px'}
              borderStyle="solid"
              flex="1"
              borderColor={colors.border.black}
              minWidth={isNextLesson ? '10px' : '7px'}
              height="20px"
              margin="0px"
              backgroundColor={color}
              borderRadius="2px"
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.1)', cursor: 'pointer' }}
              onClick={isPastLesson ? () => handleNavClick(lessonArray.find((lesson) => lesson.order_id === n)?.id) : null}
            />
          </Tooltip>
        );
      })}
    </HStack>
  );
};

export default CourseProgressVisualizer;
