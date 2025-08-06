import { upsert_ii_user_courses } from "../api/ii_user_courses";

const coursesReducer = (state, action) => {
    switch (action.type) {
        case 'SET_COURSES':
            return {...state, courses: action.payload};

        case 'SET_INSTRUCTORS':
            return {...state, instructor_options: action.payload};
        case 'SET_LEVELS':
            return {...state, level_options: action.payload};
        case 'ADD_COURSE':
            return {...state, courses: [...state.courses, action.payload]};
        case 'UPDATE_COURSE':
            console.log('updating course');
            console.log(action.payload);
            return (
            {...state,
                courses: state.courses.map(course =>
                course.id === action.payload.id ? action.payload : course)
            }
            );
        case 'UPDATE_COURSE_STATUS':
            return (
                {...state,
                    courses: state.courses.map(course =>
                    course.id === action.payload.course_id ? {...course, 'ii_user_courses':[{...course.ii_user_courses[0], status: action.payload.status}]} : course)
                }
                );
        case 'ADVANCE_COURSE_ONE_LESSON':

            return {...state,
                courses: state.courses.map(course =>
                course.id === action.payload.course_id
                    ? { ...course, ii_user_courses: [{ ...course.ii_user_courses[0], latest_lesson: parseInt(course.ii_user_courses[0].latest_lesson) + 1 }] }
                    : course
            )
        };
        case 'SET_USER_COURSE_TIMING':
            //Update the database
            const {course_id, user_id, reception_time, timezone} = action.payload;
            
                    return (
                        {...state,
                            courses: state.courses.map(course =>
                            course.id === course_id
                                ? { ...course, ii_user_courses: [{ ...course.ii_user_courses[0], reception_time, timezone }] }
                                : course
                        )
                    });
        case 'SET_USER_COURSE_SCHEDULE':
            //Update the database
                    return (
                        {...state,
                            courses: state.courses.map(course =>
                            course.id === action.payload.course_id
                                ? { ...course, ii_user_courses: [{ ...course.ii_user_courses[0], dow_schedule: action.payload.dow_schedule }] }
                                : course
                        )
                    });

        case 'ENROLL_IN_COURSE':
            return {...state,
                courses: state.courses.map(course =>
                course.id === action.payload.course_id
                    ? { ...course, ii_user_courses: [action.payload] }
                    : course
            )
            }
        case 'SET_COURSE_COUNT':
            return {...state, 
                        enrolled_courses: action.payload.enrolled_courses, 
                        created_courses: action.payload.created_courses,
                        enrolled_limit: action.payload.enrolled_limit,
                        created_limit: action.payload.created_limit,
                        can_enroll: action.payload.can_enroll,
                        can_create: action.payload.can_create,
                    };
        default:
            return state;
    }
};

export default coursesReducer;