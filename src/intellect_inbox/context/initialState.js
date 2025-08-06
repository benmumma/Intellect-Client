
const initialState = {
    userSignedUp: false,
    userStatus: 'not_signed_in',
    has_set_password: false,
    user_id: null,
    user_tier:'free',
    email_address: '',
    user_name: '',
    current_topic: '',
    topic_name: '',
    current_subject: '',
    current_audience: '',
    audience: '',
    reception_time: '',
    timezone: '',
    last_email: null,
    dow_schedule: {},
    lesson_data: [],
    audience_options: [],
    subject_options: [],
    current_subject_object: {},
    current_audience_object: {},
    chat_messages: [],
    live_session_id: null,
    is_typing: false,
    core_lessons_paused: false,
    add_course_credits: 0,
    add_course_slots: 0,
}


export default initialState;