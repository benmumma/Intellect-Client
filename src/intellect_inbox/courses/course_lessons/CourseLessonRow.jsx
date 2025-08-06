import React from 'react';
import { Tr, Td, Button, HStack, Link, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import ReadButton from '../../components/interactions/ReadButton';
import NotesComponent from '../../components/interactions/NotesComponent';
import useColors from '../../theming/useColors';


const CourseLessonRow = ({ post, index, user_id }) => {
    const lesson_sent_at = post.created_at;
    const colors = useColors();
    const user_post = post;
    const lesson_number = post.order_id;
    return (
        <Tr key={post.course_id+'-'+lesson_number}>
            <Td borderColor={colors.border.light}>{lesson_number}</Td>
            <Td borderColor={colors.border.light}>
                <HStack>
                <Button colorScheme="teal" size="sm" as={RouterLink} to={'/intellectinbox/lesson/'+post.id}>View</Button>
                <VStack alignItems="flex-start" spacing={0}>
                <Text>Lesson {lesson_number}</Text>
                <Link fontSize="lg" fontWeight="bold" color="teal" as={RouterLink} to={'/intellectinbox/lesson/'+post.id}>{post.post_name}</Link>
                </VStack>
                </HStack>
            </Td>
            <Td borderColor={colors.border.light}>{new Date(lesson_sent_at).toLocaleDateString()}</Td>
            <Td borderColor={colors.border.light}> 
                <ReadButton user_id={user_id} post_id={post.id} is_read={user_post.is_read} />
            </Td>
            <Td borderColor={colors.border.light}>
                <NotesComponent user_id={user_id} post_id={post.id} notes={user_post.notes} />
            </Td>
        </Tr>
    )
}

export default CourseLessonRow;