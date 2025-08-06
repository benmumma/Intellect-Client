
import { useCourses } from "../context/CoursesContext";
import { useIntellectInbox } from "../context/IntellectInboxContext";
import { useToast } from "@chakra-ui/react";
import { update_ii_user_post } from "../api/ii_user_posts";

export const useUserLessons = () => {
    const { state: courseState, dispatch: coursesDispatch } = useCourses();
    const { inboxState, dispatch:inboxDispatch } = useIntellectInbox();
    const toast = useToast();

    const giveUserLesson = async ({lesson_id}) => {
        const user_id = inboxState.user_id;

    };

    const completeLesson = async ({post_id, is_read}) => {
        const user_id = inboxState.user_id;
        const payload = { post_id, user_id, is_read };
        const oldLessonData = inboxState.lesson_data;
        inboxDispatch({ type: 'UPDATE_READ', payload });
        //Send update to the database
        const result = await update_ii_user_post(payload);

        if (result.result === 'success') {
            toast({ title: 'Lesson Complete!', status: 'success', duration: 3000 });
        } else {
            console.error('Error updating course timing');
            // Revert state
            inboxDispatch({ type: 'SET_LESSONS', payload: oldLessonData });
            toast({ title: 'Error updating course completion', status: 'error', duration: 3000 });
        }
    };

    const flagLesson = async ({course_id, lesson_id}) => {
    };

    const updateLessonNotes = async ({course_id, lesson_id, notes}) => {

    };

    return {completeLesson, flagLesson, updateLessonNotes, giveUserLesson};
};
