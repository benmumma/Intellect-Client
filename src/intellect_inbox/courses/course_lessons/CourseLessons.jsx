// CourseLessons.jsx
import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Text, Link, HStack } from '@chakra-ui/react';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import CourseLessonRow from './CourseLessonRow';
import useColors from '../../theming/useColors';

const CourseLessons = ({ course }) => {
    const [showCompleteLessons, setShowCompleteLessons] = useState(false);
    const { inboxState } = useIntellectInbox();
    const colors = useColors();

    const toggleShowCompleteLessons = () => {
        setShowCompleteLessons(!showCompleteLessons);
    };

    const myCourseLessons = inboxState.lesson_data
        .filter((lesson) => {
            if (course && lesson && lesson.course_id && lesson.course_id !== null && lesson.course_id !== undefined) {
                const cid = parseInt(course.id);
                const lcid = parseInt(lesson?.course_id);
                return cid === lcid;
            } else {
                return false;
            }
        })
        .sort((a, b) => a.order_id - b.order_id);

    return (
        <>
            <HStack>
                <Text>Showing: <b>{showCompleteLessons ? 'All Lessons' : 'Lessons To Do'}</b></Text>
                <Link color={colors.text.link} onClick={toggleShowCompleteLessons}>
                    Switch
                </Link>
            </HStack>
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th borderColor={colors.border.light}>#</Th>
                        <Th borderColor={colors.border.light}>Lesson Title</Th>
                        <Th borderColor={colors.border.light}>Sent</Th>
                        <Th borderColor={colors.border.light}>Complete</Th>
                        <Th borderColor={colors.border.light}>Notes</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {myCourseLessons
                        .filter((post) => (showCompleteLessons || !post.is_read))
                        .map((post, index) => (
                            <CourseLessonRow 
                                key={`${course.id}-lesson-${post.order_id}`} 
                                post={post} 
                                index={index} 
                                user_id={inboxState.user_id} 
                            />
                        ))
                    }
                </Tbody>
            </Table>
        </>
    );
};

export default CourseLessons;
