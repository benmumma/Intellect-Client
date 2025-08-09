const limits = {
    'free':{
        'weekly_lessons':5,
        'active_courses':1,
        'weekly_course_lessons':7,
        'personalized_courses':1,
        'cooldown':24,
    },
    // Deprecated: 'standard' tier now treated as 'free'
    'standard':{
        'weekly_lessons':5,
        'active_courses':1,
        'weekly_course_lessons':7,
        'personalized_courses':1,
        'cooldown':24,
    },
    'premium':{
        'weekly_lessons':7,
        'active_courses':10,
        'weekly_course_lessons':7,
        'personalized_courses':1000000,
        'cooldown':1,
    },
    'admin':{
        'weekly_lessons':5,
        'active_courses':20,
        'weekly_course_lessons':7,
        'personalized_courses':1000000,
        'cooldown':0.05,
    }
}

export default limits;