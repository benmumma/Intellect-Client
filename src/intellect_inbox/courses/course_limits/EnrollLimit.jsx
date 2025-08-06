import React from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import { useCourses } from "../../context/CoursesContext";
import { useIntellectInbox } from "../../context/IntellectInboxContext";
import useColors from "../../theming/useColors";
import limits from "../../../constants/limits";
const EnrollLimit = ({}) => {
    const { state: courseState } = useCourses();
    const { inboxState } = useIntellectInbox();
    const colors = useColors();
    const account_tier = inboxState.user_tier;
    const course_count = courseState.enrolled_courses;
    const my_enroll_limit = limits[account_tier].active_courses;

    const bgColor = course_count < my_enroll_limit-1 ? colors.bg.green :  course_count < my_enroll_limit ? colors.bg.yellow : colors.bg.red;
    return (
        <Flex p={4} bg={bgColor} borderRadius="md" mb={4} width="100%" boxShadow="lg">
            <Text fontSize="md" textColor={colors.text.inverse}>
                You have {course_count}/{my_enroll_limit} active courses.{course_count < my_enroll_limit ? ' Sign up for another one!' : ' Pause or Complete a course to enroll in another.'}
            </Text>
        </Flex>
    )
}

export default EnrollLimit;