import React, { createContext, useReducer, useContext, useEffect } from 'react';
import coursesReducer from './coursesReducer';
import { read_ii_courses } from '../api/ii_courses';
import { read_ii_instructors } from '../api/ii_instructors';
import { read_ii_levels } from '../api/ii_levels';
import { useIntellectInbox } from './IntellectInboxContext';
import limits from '../../constants/limits';

const CoursesContext = createContext();

export const CoursesProvider = ({ children }) => {
    const initial_state = {
        courses: [],
        instructor_options: [],
        level_options: [],
    }
    const [state, dispatch] = useReducer(coursesReducer, initial_state);
    const { inboxState } = useIntellectInbox();

    useEffect(() => {
        //console.log('PULLING USERS COURSES!');
        const fetchCourses = async () => {
            const fetchedCourses = await read_ii_courses(); 
            dispatch({ type: 'SET_COURSES', payload: fetchedCourses });
        };
        //console.log('fetching courses');
        fetchCourses();
    }, [inboxState.user_id]);

    //Fetch instructor options
    useEffect(() => {
        const fetchInstructors = async () => {
            const fetchedInstructors = await read_ii_instructors();
            dispatch({ type: 'SET_INSTRUCTORS', payload: fetchedInstructors });
        };
        fetchInstructors();
    }, [inboxState.user_id]);

    //Fetch level options
    useEffect(() => {
        const fetchLevels = async () => {
            const fetchedLevels = await read_ii_levels();
            dispatch({ type: 'SET_LEVELS', payload: fetchedLevels });
        };
        fetchLevels();
    }, [inboxState.user_id]);
    

    //Let's update the user course count and access levels:
    useEffect(() => {
        let enrolled_courses, created_courses, enrolled_limit, created_limit, can_enroll, can_create;
        if(!state.courses) return;
        if(!inboxState.user_id) return;
        if(!inboxState.user_tier) return;

        enrolled_courses = state.courses.filter(course => course.ii_user_courses.length > 0 && course.ii_user_courses[0].status === 1 && course.ii_user_courses[0].latest_lesson < course.course_length);
        created_courses = state.courses.filter(course => course.private_user_id === inboxState.user_id).length;
        enrolled_limit = limits[inboxState.user_tier]?.active_courses || 0;
        created_limit = limits[inboxState.user_tier].personalized_courses;
        can_enroll = enrolled_courses.length < enrolled_limit;
        can_create = created_courses < created_limit;

        dispatch({
            type:'SET_COURSE_COUNT',
            payload: {
                enrolled_courses: enrolled_courses.length,
                created_courses: created_courses,
                enrolled_limit: enrolled_limit,
                created_limit: created_limit,
                can_enroll: can_enroll,
                can_create: can_create,
            }
        })

    }, [state.courses, inboxState.user_id, inboxState.user_tier]);

    return (
        <CoursesContext.Provider value={{ state, dispatch }}>
            {children}
        </CoursesContext.Provider>
    );
};

export const useCourses = () => useContext(CoursesContext);
