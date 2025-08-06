import { useIntellectInbox } from "../context/IntellectInboxContext";
import { useToast } from "@chakra-ui/react";
import { upsert_ii_user } from "../api/ii_users";
import { format_dow_schedule } from "../helpers/reception_days";

export const useUsers = () => {
    const { inboxState, dispatch } = useIntellectInbox();
    const toast = useToast();

    const updateUserSchedule = async ({reception_days}) => {
        const oldSchedule = inboxState.dow_schedule;
        //console.log(reception_days)

        const new_dow_schedule = format_dow_schedule(reception_days, oldSchedule);
        //console.log(new_dow_schedule);
       
        const user_id = inboxState.user_id;
        const payload = { user_id, dow_schedule: new_dow_schedule };

        //Update the database
        const result = await upsert_ii_user(payload);

        //Update the state
        if (result.result === 'success') {
            dispatch({ type: 'SET_SCHEDULE', payload: new_dow_schedule });
            toast({ title: 'Course schedule updated', status: 'success', duration: 1000 });
        }
        else {
            console.error('Error updating course schedule');
            // Revert state
            dispatch({ type: 'SET_SCHEDULE', payload: oldSchedule });
            toast({ title: 'Error updating course schedule', status: 'error', duration: 1000 });
        }
    }

    const pauseUserDailyLessons = async ({core_lessons_paused}) => {
        const old_core_lessons_paused = inboxState.core_lessons_paused;
        const user_id = inboxState.user_id;
        const payload = { user_id, core_lessons_paused };

        //Update the database
        const result = await upsert_ii_user(payload);

        //Update the state
        if (result.result === 'success') {
            dispatch({ type: 'SET_CORE_LESSONS_PAUSED', payload: core_lessons_paused });
            const message = core_lessons_paused ? 'Core lessons paused' : 'Core lessons unpaused';
            toast({ title: message, status: 'success', duration: 1000 });
        }
        else {
            console.error('Error pausing core lessons');
            // Revert state
            dispatch({ type: 'SET_CORE_LESSONS_PAUSED', payload: old_core_lessons_paused });
            toast({ title: 'Error pausing core lessons', status: 'error', duration: 1000 });
        }


    }


    

    return {updateUserSchedule, pauseUserDailyLessons};
};
