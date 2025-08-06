
import React from 'react';
import { Tr, Td, VStack, Heading, Text, HStack, Button, useMediaQuery, Box, Collapse, Tooltip} from '@chakra-ui/react';
import { useCourses } from '../../context/CoursesContext';
import { useUserCourses } from '../../actions/useUserCourses';
import useColors from '../../theming/useColors';
import { useNavigate } from 'react-router-dom';
import CourseLengthVisualizer from '../../components/visuals/CourseLengthVisualizer';
import CourseLevelVisualizer from '../../components/visuals/CourseLevelVisualizer';
import CurriculumTable from '../../components/tables/CurriculumTable';
import RatingVisualizer from '../../components/visuals/RatingVisualizer';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import TeacherVisualizer from '../../components/visuals/TeacherVisualizer';
const DirectoryRow = ({course, modFunction, mode="private"}) => {
    //console.log(course);
    const navigate = useNavigate();
    const { state: courseState } = useCourses();
    const {inboxState} = useIntellectInbox();   
    const { enrollInCourse } = useUserCourses();
    const colors = useColors();
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const [showCurriculum, setShowCurriculum] = React.useState(false);
    const toggleShowCurriculum = () => setShowCurriculum(!showCurriculum);
    const user_tier = inboxState.user_tier;
    const is_premium = user_tier === 'premium' || user_tier === 'admin'; 

    const handleEnrollment = (course_id) => {
        if(mode === "private") {
        console.log('Enrolling in course', course_id);
        enrollInCourse({course_id:course_id})
        }
        else {
            console.log('Redirecting to course page', course_id);
            navigate(`/course/${course_id}`)
        }
    }

    const course_name = course.display_name ? course.display_name : course.course_subject;
    const teacher_name = courseState.instructor_options.find((instructor) => instructor.text_id === course.teacher_persona).name;
    const level_name = courseState.level_options.find((level) => level.level_id === course.course_level).name;
    //console.log(course);
    return (
        <>
    <Tr key={course.id}>
        <Td padding={isMobile?1:4}>
            <VStack alignItems="flex-start" width="100%">
            <HStack width="100%" alignItems="flex-start">
                <VStack alignItems="flex-start" spacing={2} flex="1">
                <Button colorScheme="teal" 
                        size="sm" 
                        height={isMobile ? '60px':'inherit'} 
                        padding={4} 
                        onClick={() => handleEnrollment(course.id)} 
                        isDisabled={(mode==='private' && !courseState.can_enroll)}>
                        {mode==='private' && 'Enroll!'}
                        {mode==='public' && 'View Course'}
                    </Button>
                    <Tooltip label={is_premium ? "Modify this course!" : "Join today to modify courses!"}>
                <Button colorScheme="teal" variant="outline" isDisabled={user_tier !== 'premium' && user_tier !== 'admin'} size="sm" onClick={() => modFunction(course)}>
                    Modify
                </Button>
                </Tooltip>
                </VStack>
            <VStack alignItems="flex-start" spacing={0} flex="3">
                <HStack justifyContent="space-between" width="100%">
                <Heading size="md" textColor={colors.text.header}>{course_name}</Heading>
                <Button size="sm" colorScheme="teal" variant="ghost" onClick={() => toggleShowCurriculum()}>Details</Button>
                </HStack>
                <Text fontSize="sm" textColor={colors.text.main}>{course.course_description}</Text>
                <RatingVisualizer total_rating={course.total_rating} total_reviews={course.total_reviews} />
            </VStack>
            </HStack>
            {isMobile && <>
            <HStack width="100%" justifyContent="space-between">
                <TeacherVisualizer teacher_data={course.ii_instructors} custom_override={course.custom_instructor_details} />

            <VStack width="100%" alignItems="flex-start">
                <Text>{course.language}</Text>
            <CourseLengthVisualizer days={course.course_length} />
            <CourseLevelVisualizer level={course.course_level} />
            </VStack>
            </HStack>
            </>}
            </VStack>
            </Td>
        {!isMobile && <><Td>
            <VStack alignItems="flex-start">
            <TeacherVisualizer teacher_data={course.ii_instructors} custom_override={course.custom_instructor_details} />
                
            </VStack>
            </Td>
            <Td>
        <VStack alignItems="flex-start">
                <CourseLengthVisualizer days={course.course_length} />
                <CourseLevelVisualizer level={course.course_level} />
                <Text fontSize="sm" fontStyle="oblique" textColor={colors.text.context}>{course.language}</Text>
            </VStack>
        </Td></>}
    </Tr>
    <Tr key={`${course.id}-curriculum`}>
    <Td colSpan="5" padding={0} borderBottom="1px solid" borderColor={colors.border.main}>
        <Collapse in={showCurriculum} animateOpacity>
            <Box padding={4} background={colors.bg.darker} borderRadius="md">
               <CurriculumTable curriculum={course.curriculum} />
            </Box>
        </Collapse>
    </Td>
</Tr>
</>
    )
}

export default DirectoryRow;