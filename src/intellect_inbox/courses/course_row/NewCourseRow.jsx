// CourseRow.jsx
import React, { useState } from 'react';
import { Tr, Td, VStack, HStack, Heading, Icon, Collapse, Box, Text, Divider, Popover, useMediaQuery, PopoverTrigger, Button, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody} from '@chakra-ui/react';
import CourseDetails from './CourseDetails';
import CourseSchedule from './CourseSchedule';
import CourseStatus from './CourseStatus';
import CourseActions from './CourseActions';
import CourseLessons from '../course_lessons/CourseLessons';
import useColors from '../../theming/useColors';
import { useCourses } from '../../context/CoursesContext';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import { AiOutlineCaretDown, AiOutlineCaretRight, AiOutlineInfoCircle } from 'react-icons/ai';
import GeneralLessonTable from '../../components/tables/GeneralLessonTable';
import TeacherVisualizer from '../../components/visuals/TeacherVisualizer';

const NewCourseRow = ({ course }) => {
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const [isMidScreen] = useMediaQuery("(max-width: 72em)");
    const tdPadding = isMobile ? 1 : isMidScreen ? 2 : 4;
    const [showLessons, setShowLessons] = useState(false);
    const colors = useColors();
    const { state: courseState } = useCourses();
    const { inboxState } = useIntellectInbox();


    const toggleShowLessons = () => setShowLessons(!showLessons);
    const course_display_name = course?.display_name ?? course?.course_subject ?? '';
    let course_status = course.ii_user_courses[0].status;
    let current_lesson = course.ii_user_courses[0].latest_lesson;
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


    const courseLessons = inboxState.lesson_data.filter(lesson => lesson.course_id === course.id);

    const totalLessons = courseLessons.length;
    const unread_lessons = courseLessons.filter(lesson => !lesson.is_read).length;
    
    
    return (
        <>
            <Tr key={course.id}>
                <Td borderBottom="1px solid gray" colSpan={isMobile ? 1 : 1} padding={tdPadding} minWidth="300px">
                    <VStack alignItems="flex-start" spacing={0}>
                        <HStack>
                            <VStack alignItems="flex-start" spacing={0}>
                            <Box as={HStack}>
                                <Box as={HStack} cursor="pointer" onClick={toggleShowLessons}>
                                <Icon as={showLessons ? AiOutlineCaretDown : AiOutlineCaretRight} boxSize={4} color={colors.text.main} />
                                <Heading size={isMobile ? 'md':'md'} color={colors.text.main} _hover={{ textDecoration: 'underline' }}>
                                    {course_display_name}
                                </Heading>
                                </Box>
                                <Popover>
                                <PopoverTrigger>
                                    <Button colorScheme="teal" size={isMobile ? 'md':'md'} variant="ghost"><AiOutlineInfoCircle /></Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Course Details</PopoverHeader>
                                    <PopoverBody>
                                        <Text fontWeight="bold" mb={2}>Course Description:</Text>
                                        <Text>{course.course_description}</Text>
                                        <Divider my={2} />
                                        <Text fontWeight="bold" mb={2}>Teacher:</Text>
                                        <TeacherVisualizer teacher_data={course.ii_instructors} custom_override={course.custom_instructor_details} />
                                        <Divider my={2} />

                                        {/*<Text fontWeight="bold" mb={2}>Course Details:</Text>
                                        <Text>{course.course_details}</Text>*/}
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                            </Box>
                            {course.language !== 'English' && course.language !== 'english' && (
                                <Text fontSize={isMobile ? 'sm':'sm'} fontStyle="oblique" color={colors.text.context}> in {course.language}</Text>
                            )}
                            <HStack>
                            <Text ml={4} fontSize={isMobile ? 'sm':'sm'} textColor={colors.text.context}>Total: {totalLessons}</Text>
                            <Text fontSize={isMobile ? 'sm':'sm'}> | </Text>
                            <Text fontSize={isMobile ? 'sm':'sm'} fontWeight={unread_lessons > 0 ? 'bold' : 'normal'} textColor={unread_lessons > 0 ? colors.text.warning : colors.text.success}>Unread: {unread_lessons}</Text>
                            </HStack>
                            </VStack>
                            
                            
                        </HStack>
                    {isMobile && <><Divider my={1} /><CourseSchedule course={course} isMobile={isMobile} padding={tdPadding} width="100%" /></>}
                    {isMobile && <><Divider my={1} /><CourseActions course={course} isMobile={isMobile} padding={tdPadding} /></>}
                    </VStack>
                </Td>
                {!isMobile && <CourseDetails course={course} isMobile={isMobile} padding={tdPadding}/>}
                {!isMobile && <CourseSchedule course={course} isMobile={isMobile} padding={tdPadding} status={cs_text} width="100%"/>}
                {!isMobile && !isMidScreen && <CourseStatus course={course} isMobile={isMobile} padding={tdPadding} />}
                {!isMobile && <CourseActions course={course} padding={tdPadding} />}
            </Tr>
            <Tr key={`${course.id}-lessons`}>
                <Td colSpan="5" padding={0} borderBottom="1px solid" borderColor={colors.border.main}>
                    <Collapse in={showLessons} animateOpacity>
                        <Box padding={4} background={colors.bg.darker} borderRadius="md">
                           <GeneralLessonTable lessons={courseLessons} course_id={course.id} />
                        </Box>
                    </Collapse>
                </Td>
            </Tr>
        </>
    );
};

export default NewCourseRow;