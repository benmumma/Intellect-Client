// hooks/useUpdateCourseTiming.js
import { useCourses } from "../context/CoursesContext";
import { useIntellectInbox } from "../context/IntellectInboxContext";
import { useToast } from "@chakra-ui/react";
import { upsert_ii_user_courses } from "../api/ii_user_courses";
import { format_dow_schedule } from "../helpers/reception_days";

export const useUserCourses = () => {
    const { state: courseState, dispatch: coursesDispatch } = useCourses();
    const { inboxState } = useIntellectInbox();
    const toast = useToast();

    const updateCourseTiming = async ({course_id, reception_time, timezone}) => {
        const user_id = inboxState.user_id;
        const payload = { course_id, user_id, reception_time, timezone };
        const oldCourseState = courseState.courses;
        console.log(payload)

        const result = await upsert_ii_user_courses(payload);

        if (result.result === 'success') {
            coursesDispatch({ type: 'SET_USER_COURSE_TIMING', payload });
            toast({ title: 'Course timing updated', status: 'success', duration: 3000 });
        } else {
            console.error('Error updating course timing');
            // Revert state
            coursesDispatch({ type: 'SET_COURSES', payload: oldCourseState });
            toast({ title: 'Error updating course timing', status: 'error', duration: 3000 });
        }
    };

    const updateCourseSchedule = async ({course_id, reception_days}) => {
        const dow_schedule = format_dow_schedule(reception_days, null);
        const user_id = inboxState.user_id;
        const payload = { course_id, user_id, dow_schedule };
        const oldCourseState = courseState.courses;
        console.log(payload)

        const result = await upsert_ii_user_courses(payload);

        if (result.result === 'success') {
            coursesDispatch({ type: 'SET_USER_COURSE_SCHEDULE', payload });
            toast({ title: 'Course schedule updated', status: 'success', duration: 1000 });
        }
        else {
            console.error('Error updating course schedule');
            // Revert state
            coursesDispatch({ type: 'SET_COURSES', payload: oldCourseState });
            toast({ title: 'Error updating course schedule', status: 'error', duration: 1000 });
        }
    }

    const enrollInCourse = async ({course_id}) => {
        const user_id = inboxState.user_id;
        const dow_schedule = format_dow_schedule(['Mon','Wed','Fri'], null);
        console.log(dow_schedule)
        const payload = { course_id: course_id, 
                            user_id: user_id, 
                            latest_lesson: 0, 
                            status: 1, 
                            timezone: inboxState.timezone, 
                            reception_time: inboxState.reception_time,
                            dow_schedule: dow_schedule
        };
        const oldCourseState = courseState.courses;
        console.log(payload)

        const result = await upsert_ii_user_courses(payload);

        if (result.result === 'success') {
            coursesDispatch({ type: 'ENROLL_IN_COURSE', payload });
            toast({ title: 'Welcome to the course, you are now enrolled!', status: 'success', duration: 3000 });
        }
        else {
            console.error('Error enrolling in course');
            // Revert state
            coursesDispatch({ type: 'SET_COURSES', payload: oldCourseState });
            toast({ title: 'Error enrolling in course', status: 'error', duration: 3000 });
        }
    }

    const pauseCourse = async ({course_id}) => {
        const user_id = inboxState.user_id;
        const payload = { course_id, user_id, status: 2 };
        const oldCourseState = courseState.courses;
        console.log(payload)

        const result = await upsert_ii_user_courses(payload);

        if (result.result === 'success') {
            coursesDispatch({ type: 'UPDATE_COURSE_STATUS', payload });
            toast({ title: 'Course paused', status: 'success', duration: 3000 });
        }
        else {
            console.error('Error pausing course');
            // Revert state
            coursesDispatch({ type: 'SET_COURSES', payload: oldCourseState });
            toast({ title: 'Error pausing course', status: 'error', duration: 3000 });
        }
    }

    const archiveCourse = async ({course_id}) => {
        const user_id = inboxState.user_id;
        const payload = { course_id, user_id, status: 3 };
        const oldCourseState = courseState.courses;
        console.log(payload)

        const result = await upsert_ii_user_courses(payload);

        if (result.result === 'success') {
            coursesDispatch({ type: 'UPDATE_COURSE_STATUS', payload });
            toast({ title: 'Course archived', status: 'success', duration: 3000 });
        }
        else {
            console.error('Error archiving course');
            // Revert state
            coursesDispatch({ type: 'SET_COURSES', payload: oldCourseState });
            toast({ title: 'Error archiving course', status: 'error', duration: 3000 });
        }
    }

    const activateCourse = async ({course_id}) => {
        const user_id = inboxState.user_id;
        const payload = { course_id, user_id, status: 1 };
        const oldCourseState = courseState.courses;
        console.log(payload)

        const result = await upsert_ii_user_courses(payload);

        if (result.result === 'success') {
            coursesDispatch({ type: 'UPDATE_COURSE_STATUS', payload });
            toast({ title: 'Course activated', status: 'success', duration: 3000 });
        }
        else {
            console.error('Error activating course');
            // Revert state
            coursesDispatch({ type: 'SET_COURSES', payload: oldCourseState });
            toast({ title: 'Error activating course', status: 'error', duration: 3000 });
        }
    }

    return {updateCourseTiming, updateCourseSchedule, enrollInCourse, pauseCourse, archiveCourse, activateCourse};
};