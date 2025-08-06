import React from "react";
import { Text , HStack, Box} from "@chakra-ui/react";
import { useIntellectInbox } from "../context/IntellectInboxContext";

import useColors from "../theming/useColors";
import LcNavBox from "./LcNavBox";

const LessonCourseNav = ({thisLesson}) => {
    const { inboxState } = useIntellectInbox();

    //Find other lessons in this course
    //console.log(thisLesson);
    //console.log(inboxState);
    const colors = useColors();
    const courseLessons = inboxState.lesson_data.filter(lesson => parseInt(lesson.course_id) === parseInt(thisLesson.course_id)).sort((a, b) => a.order_id - b.order_id);

    return (
        <>
        <HStack width="100%" maxHeight="75px" px={0} py={0}  spacing={0} alignItems="stretch" borderBottom="1px solid" borderColor={colors.border.main} boxShadow="md" >
            {courseLessons.map((lesson, index) => {
                const isCurrent = lesson.id === thisLesson.id;
                return (
                <LcNavBox lesson={lesson} index={index} isCurrent={isCurrent} key={lesson.id} />
            )}
            )}

        </HStack>
        </>
    )
}

export default LessonCourseNav;