// CourseActions.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Td, Button, useToast, ButtonGroup, IconButton, Tooltip, HStack, useMediaQuery} from '@chakra-ui/react';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import { useCourses } from '../../context/CoursesContext';
import { useUserCourses } from '../../actions/useUserCourses';
import { read_ii_user_posts_v2 } from '../../api/ii_user_posts';
import { API_BASE_URL } from '../../../constants/constants';
import { FaPlayCircle, FaPauseCircle, FaArchive, FaShare } from 'react-icons/fa';
import limits from '../../../constants/limits';
import { read_ii_courses } from '../../api/ii_courses';

const CourseActions = ({ course, ...props }) => {
    const [nextLessonDisabled, setNextLessonDisabled] = useState(true);
    const [nextLessonLoading, setNextLessonLoading] = useState(false);
    const [isMidScreen] = useMediaQuery("(max-width: 72em)");
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const { state: courseState } = useCourses();
    const [timeLeft, setTimeLeft] = useState(0);
    const { inboxState, dispatch } = useIntellectInbox();
    const { dispatch: coursesDispatch } = useCourses();
    const { archiveCourse, pauseCourse, activateCourse } = useUserCourses();
    const toast = useToast();

    const course_level = course.course_level;
    const course_teacher = course.teacher_persona;
    const course_status = course.ii_user_courses[0].status;
    const level_name = courseState?.level_options?.find((level) => level.level_id === course?.course_level)?.name ?? '';
    const teacher_name = courseState?.instructor_options?.find((instructor) => instructor.text_id === course?.teacher_persona)?.name ?? '';
    let current_lesson = course.ii_user_courses[0].latest_lesson;
    const userHasCourseCapacity = courseState.can_enroll;
    let nextMessage = 'Next Lesson!';
    if(isMidScreen) {
        nextMessage = 'Next';
    }

    const handleShareClick = (course_id) => {
        const course_url = `${window.location.origin}/course/${course_id}`;
        navigator.clipboard.writeText(course_url);
        toast({
            title: 'Link Copied',
            description: 'The course link has been copied to your clipboard',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleStatusUpdate = async (status) => {
        if (status === 'pause') {
            pauseCourse({ course_id: course.id });
        } else if (status === 'archive') {
            archiveCourse({ course_id: course.id });
        } else if (status === 'activate') {
            activateCourse({ course_id: course.id });
        }
    };

    const getLastLessonTime = useCallback(() => {
        const lessonTimes = inboxState.lesson_data
            .filter(lesson => lesson.course_id === course.id)
            .map(lesson => new Date(lesson.created_at).getTime());
        return Math.max(...lessonTimes, 0); // Use 0 if there are no lessons
    }, [inboxState.lesson_data, course.id]);

    const calculateTimeLeft = useCallback(() => {
        let timeLimit = limits[inboxState.user_tier].cooldown*60;
        const tl_mili = timeLimit * 60 * 1000;
        const lastLessonTime = getLastLessonTime();
        const timeSinceLastLesson = Date.now() - lastLessonTime;
        const remainingTime = Math.max(0, tl_mili - timeSinceLastLesson);
        return Math.ceil(remainingTime / 60000); // Convert to minutes and round up
    }, [inboxState.user_tier, getLastLessonTime]);

    useEffect(() => {
        const updateTimer = () => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            setNextLessonDisabled(newTimeLeft > 0);
        };

        updateTimer(); // Initial update

        const interval = setInterval(updateTimer, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [calculateTimeLeft, inboxState, course]);

    const handleNextLessonClick = async () => {
        let using_extra_pull = false;
        let data_to_send = {};
        if (nextLessonDisabled) 
            {
            toast({
                title: 'Error',
                description: `Please wait ${timeLeft} minutes before creating the next lesson`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            };
        if (course.curriculum === null) {
            using_extra_pull = true;
            //Instead - re-pull the course from the API and update state.
            const course_id = course.id;
            const this_course = await read_ii_courses(course_id);
            console.log(this_course);
            coursesDispatch({ type: 'UPDATE_COURSE', payload: this_course[0] });
            data_to_send.last_lesson= current_lesson > 0 ? this_course[0].curriculum.Schedule[current_lesson - 1] : null
            data_to_send.this_lesson= current_lesson <= this_course[0].course_length ? this_course[0].curriculum.Schedule[current_lesson] : null
            data_to_send.next_lesson= current_lesson + 1 <= this_course[0].course_length ? this_course[0].curriculum.Schedule[current_lesson + 1] : null
        };

        setNextLessonLoading(true);
        // Prepare data for the API call
        const teacher_descriptor = courseState.instructor_options.find((instructor) => instructor.text_id === course.teacher_persona).instructions;
        const instructor_details = course.teacher_persona === 'custom' ? course.custom_instructor_details : teacher_descriptor;

        data_to_send.course_id = course.id;
        data_to_send.course_name = course.course_subject;
        data_to_send.user_id = inboxState.user_id;
        data_to_send.email_address = inboxState.email_address;
        data_to_send.user_name = inboxState.user_name;
        data_to_send.lesson_to_build = current_lesson + 1;
        data_to_send.course_details = course.course_details;
        data_to_send.level_name = level_name;
        data_to_send.teacher_name = teacher_name;
        data_to_send.course_length = course.course_length;
        data_to_send.language = course.language;
        data_to_send.custom_instructor_details = instructor_details;

        if (!using_extra_pull) {
            data_to_send.last_lesson= current_lesson > 0 ? course.curriculum.Schedule[current_lesson - 1] : null
            data_to_send.this_lesson= current_lesson <= course.course_length ? course.curriculum.Schedule[current_lesson] : null
            data_to_send.next_lesson= current_lesson + 1 <= course.course_length ? course.curriculum.Schedule[current_lesson + 1] : null
        }


        try {
            const response = await fetch(`${API_BASE_URL}intellectinbox/createNextLesson`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data_to_send),
            });

            const response_data = await response.json();

            if (response_data.result === 'success') {
                toast({
                    title: 'Lesson Created',
                    description: 'The next lesson has been created successfully',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });

                coursesDispatch({ type: 'ADVANCE_COURSE_ONE_LESSON', payload: { course_id: course.id } });

                const new_lesson = await read_ii_user_posts_v2({
                    user_id: inboxState.user_id,
                    limit_param: 1,
                    course_id: course.id,
                    order_id: current_lesson + 1
                });
                dispatch({ type: 'ADD_NEW_LESSON', payload: new_lesson[0] });

                // Reset the timer
                setTimeLeft(calculateTimeLeft());
                setNextLessonDisabled(true);
            } else {
                console.error('Failed to create next lesson');
                toast({
                    title: 'Error',
                    description: 'Failed to create the next lesson',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error creating next lesson:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while creating the next lesson',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setNextLessonLoading(false);
        }
    };

    return (
        <Td width="100%" borderBottom={isMobile ? "": "1px solid gray"} {...props}>
            <HStack width="100%" spacing={1} justifyContent="flex-end">
            {current_lesson === course.course_length ? (
                <Button width="100%" colorScheme="green" size="sm" isDisabled>All Done!</Button>
            ) : course_status > 1 ? '' : (
                <Button
                    colorScheme="teal"
                    size="sm"
                    width="100%"
                    isDisabled={nextLessonDisabled || nextLessonLoading}
                    onClick={handleNextLessonClick}
                >
                    {nextLessonLoading ? 'Building...' : nextLessonDisabled ? `Wait ${timeLeft} minutes` : nextMessage}
                </Button>
            )}
            <ButtonGroup>
                    {course.ii_user_courses[0].status !== 1 && (
                        <Tooltip label={userHasCourseCapacity ? "Activate" : "You are at your course limit. Please pause a different course first."}>
                            <IconButton
                                colorScheme="green"
                                variant="ghost"
                                size="sm"
                                icon={<FaPlayCircle />}
                                isDisabled={!userHasCourseCapacity}
                                onClick={() => handleStatusUpdate('activate')}
                            />
                        </Tooltip>
                    )}
                    {course.ii_user_courses[0].status !== 2 && (
                        <Tooltip label="Pause">
                            <IconButton
                                colorScheme="yellow"
                                variant="ghost"
                                size="sm"
                                icon={<FaPauseCircle />}
                                onClick={() => handleStatusUpdate('pause')}
                            />
                        </Tooltip>
                    )}
                    {course.ii_user_courses[0].status !== 3 && (
                        <Tooltip label="Archive">
                            <IconButton
                                colorScheme="gray"
                                variant="ghost"
                                size="sm"
                                icon={<FaArchive />}
                                onClick={() => handleStatusUpdate('archive')}
                            />
                        </Tooltip>
                    )}
                    {course.is_public && <Tooltip label="Share">
                        <IconButton
                            colorScheme="teal"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShareClick(course.id)}
                            icon={<FaShare />}
                        />
                    </Tooltip>}
                </ButtonGroup>
                </HStack>
        </Td>
    );
};

export default CourseActions;