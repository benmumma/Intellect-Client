import React from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import { useCourses } from "../../context/CoursesContext";
import { useIntellectInbox } from "../../context/IntellectInboxContext";
import useColors from "../../theming/useColors";
import limits from "../../../constants/limits";
const CreateLimit = ({}) => {
    const { state: courseState } = useCourses();
    const { inboxState } = useIntellectInbox();
    const colors = useColors();
    const account_tier = inboxState.user_tier;
    const course_count = courseState?.created_courses || 0;
    const my_create_limit = limits[account_tier].personalized_courses;
    const free_message = `${account_tier.substring(0,1).toUpperCase()+account_tier.substring(1,)} users can only create ${my_create_limit} personalized courses. You have made ${course_count}/${my_create_limit} personalized courses so far`;
    const bgColor = course_count < my_create_limit-1 ? colors.bg.green :  course_count < my_create_limit ? colors.bg.yellow : colors.bg.red;
    return (
        <Flex p={4} bg={bgColor} borderRadius="md" mb={4} width="100%" boxShadow="lg">
            {!(account_tier === 'premium' || account_tier === 'admin') && 
            <Text fontSize="md" textColor={colors.text.inverse}>
                {free_message}
            </Text>}
            {(account_tier === 'premium' || account_tier==='admin') &&
            <Text fontSize="md" textColor={colors.text.inverse}>
                Thanks for being a Premium Member! You have made {course_count} personalized courses so far.
            </Text>}
        </Flex>
    )
}

export default CreateLimit;