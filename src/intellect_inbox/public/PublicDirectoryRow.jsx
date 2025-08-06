
import React from 'react';
import { Tr, Td, VStack, Heading, Text, HStack, Button, useMediaQuery} from '@chakra-ui/react';
import useColors from '../theming/useColors';
import { useNavigate } from 'react-router-dom';
import CourseLengthVisualizer from '../components/visuals/CourseLengthVisualizer';
import CourseLevelVisualizer from '../components/visuals/CourseLevelVisualizer';
import RatingVisualizer from '../components/visuals/RatingVisualizer';
import TeacherVisualizer from '../components/visuals/TeacherVisualizer';
const PublicDirectoryRow = ({course}) => {
    console.log(course);
    const navigate = useNavigate();
    const colors = useColors();
    const [isMobile] = useMediaQuery("(max-width: 48em)");



    const handleEnrollment = (course_id) => {
            console.log('Redirecting to course page', course_id);
            navigate(`/course/${course_id}`)
    }

    const course_name = course.display_name ? course.display_name : course.course_subject;
    const teacher_name = course.ii_instructors.name;
    const level_name = course.ii_levels.name;
    //console.log(course);
    return (
        <Tr key={course.id}>
            <Td padding={isMobile ? 1 : 4}>
                <VStack alignItems="flex-start" width="100%">
                    <HStack width="100%" alignItems="flex-start">
                        <Button
                            colorScheme="teal"
                            size="sm"
                            height={isMobile ? '60px' : 'inherit'}
                            padding={4}
                            onClick={() => handleEnrollment(course.id)}
                        >
                            View Course
                        </Button>
                        <VStack alignItems="flex-start" spacing={0} flex="3">
                            <Heading size="md" textColor={colors.text.header}>
                                {course_name}
                            </Heading>
                            <Text fontSize="sm" textColor={colors.text.main}>
                                {course.course_description}
                            </Text>
                            {course.total_rating !== null && (
                                <RatingVisualizer total_rating={course.total_rating} total_reviews={course.total_reviews} />
                            )}
                        </VStack>
                    </HStack>
                    {isMobile && (
                        <>
                            <HStack width="100%" px={2}>
                            <TeacherVisualizer teacher_data={course.ii_instructors} custom_override={course.custom_instructor_details} />
                            
                            <VStack width="100%" alignItems="flex-start">
                                <CourseLengthVisualizer days={course.course_length} />
                                <CourseLevelVisualizer level={course.course_level} />
                                {course.language !=='English' && <Text>{course.language}</Text>}
                            </VStack>
                            </HStack>
                        </>
                    )}
                </VStack>
            </Td>
            {!isMobile && (
                <>
                    <Td>
                        <VStack alignItems="flex-start">
                            <TeacherVisualizer teacher_data={course.ii_instructors} custom_override={course.custom_instructor_details} />
                            
                        </VStack>
                    </Td>
                    <Td>
                        <VStack alignItems="flex-start">
                            <CourseLengthVisualizer days={course.course_length} />
                            <CourseLevelVisualizer level={course.course_level} />
                            <Text fontSize="sm" fontStyle="oblique" textColor={colors.text.context}>
                                {course.language}
                            </Text>
                        </VStack>
                    </Td>
                </>
            )}
        </Tr>
    );
}

export default PublicDirectoryRow;