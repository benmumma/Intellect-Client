// Define reducer function
import initialState from "./initialState";

const inboxReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_STATE':
            return { ...state, ...action.payload };
        case 'RESET_STATE':
            console.log(initialState);
            return {...initialState};
        case 'SET_LESSONS':
            return { ...state, lesson_data: action.payload };
        case 'SET_SUBJECT_OPTIONS':
            return { ...state, subject_options: action.payload };
        case 'SET_AUDIENCE_OPTIONS':
            return { ...state, audience_options: action.payload };
        case 'ADD_NEW_LESSON':
            return { ...state, lesson_data: [action.payload, ...state.lesson_data] };
        case 'UPDATE_LAST_EMAIL':
            return { ...state, last_email: action.payload };
        case 'SET_SCHEDULE':
            return { ...state, dow_schedule: action.payload };
        case 'SET_CORE_LESSONS_PAUSED':
            return { ...state, core_lessons_paused: action.payload };
        case 'UPDATE_RATING':
            const updatedLessonData = state.lesson_data.map(lesson => {
                if (lesson.id === action.payload.post_id) {
                let updatedLesson = { ...lesson };
                    updatedLesson.rating = action.payload.rating;
                    return updatedLesson;
                }
                return lesson;
            });
            return { ...state, lesson_data: updatedLessonData };

        case 'UPDATE_CHAT_MESSAGES':
            return { ...state, chat_messages: [...state.chat_messages, ...action.payload] };

        case 'UPDATE_FLAG':
            const updatedLessonDataFlag = state.lesson_data.map(lesson => {
                if (parseInt(lesson.id) === parseInt(action.payload.post_id)) {
                    let updatedLesson = { ...lesson };
                    updatedLesson.is_flagged = action.payload.is_flagged;
                    return updatedLesson;
                }
                return lesson;
            });
            return { ...state, lesson_data: updatedLessonDataFlag };

        case 'UPDATE_READ':
            //console.log('updating read status for post_id', action.payload.post_id, 'to', action.payload.is_read);
            const updatedLessonDataRead = state.lesson_data.map(lesson => {
                if (parseInt(lesson.id) === parseInt(action.payload.post_id)) {
                    console.log('setting is_read equal to', action.payload.is_read, 'for post_id', action.payload.post_id);
                    return { ...lesson, is_read: action.payload.is_read };
                }
                return lesson;
            });
            return { ...state, lesson_data: updatedLessonDataRead };

        case 'UPDATE_NOTES':
            const updatedLessonDataNotes = state.lesson_data.map(lesson => {
                if (parseInt(lesson.id) === parseInt(action.payload.post_id)) {
                    let updatedLesson = { ...lesson };
                    updatedLesson.notes = action.payload.notes;
                    return updatedLesson;
                }
                return lesson;
            });
            return { ...state, lesson_data: updatedLessonDataNotes };

        case 'SET_CHAT_MESSAGES':
            return { ...state, chat_messages: action.payload}
        case 'UPDATE_LIVE_SESSION_ID':
            //console.log('updating live session id to', action.payload)
            return { ...state, live_session_id: action.payload };

        case 'SET_IS_TYPING':
            return { ...state, is_typing: action.payload };
        case 'INBOX_SIGN_OUT':
            return  {...initialState};
        case 'SET_ADMIN_DATA':
            return { ...state, admin_data: action.payload };
        default:
            throw new Error(`Unsupported action type: ${action.type}`);
    }
};
export default inboxReducer;