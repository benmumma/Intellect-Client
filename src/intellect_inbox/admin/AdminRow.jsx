

import React from 'react';
import { useToast, Text, Box, Tr, Td, Link, VStack, Button } from "@chakra-ui/react";
import { useIntellectInbox } from '../context/IntellectInboxContext';
import AdminEdit from './AdminEdit';


function AdminRow({lesson}) {
    const { inboxState, dispatch } = useIntellectInbox(); 
    
    if(!inboxState.admin_data) {
        return (
            <Box>
                <Text>Loading...</Text>
            </Box>
        );
    }

    const version_list = lesson.ii_post_versions.map((version) => {
        return (
            <Text key={'lesson-'+lesson.id+'-v'+version.version}>V{version.version}:<Link color="teal" href={version.post_url} target="_blank">Link</Link></Text>
        );
    });

    const lesson_status = lesson.status === 1 ? 'Active' : 'Deleted';
    const subject_name = lesson?.ii_subjects?.subject_name || '';
    const audience_name = lesson?.ii_audiences?.audience_name || '';

    const reception_count = lesson?.ii_user_posts?.length || 0;

    const rated_count = lesson.ii_user_posts.filter((post) => post.rating > 0).length;
    const sum_ratings = lesson.ii_user_posts.reduce((acc, post) => acc + post.rating, 0);
    const average_rating = rated_count > 0 ? sum_ratings / rated_count : 0;
    const discussion_thread_count = lesson.ii_user_posts.filter((post) => post.thread_id).length;






    return (
        <Tr key={'admin-'+lesson.id+'-v'+lesson.version}>
            <Td>{lesson.id}</Td>
            <Td maxWidth="200px">
                <VStack spacing={0} alignItems="flex-start">
                    <Text fontWeight="bold">{lesson.post_name}</Text>
                    <Text>Live: 
                        V{lesson.version}&nbsp;
                        built on&nbsp;
                        {new Date(lesson.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </Text>
                </VStack>
            </Td>
            <Td>{lesson_status}</Td>
            <Td>
                <VStack spacing={0} alignItems="flex-start">
                    <Text>{subject_name}</Text>
                    <Text>{audience_name}</Text>
                </VStack>
            </Td>
            <Td>{version_list}</Td>
            <Td>
                <VStack spacing={0} alignItems="flex-start">
                    <Text>{reception_count} Sent</Text>
                    <Text>{rated_count} Rated</Text>
                    <Text>{average_rating.toFixed(2)} Avg</Text>
                    <Text>{discussion_thread_count} Threads</Text>
                </VStack>
            </Td>
            <Td>
                <AdminEdit lesson={lesson} />
            </Td>
        </Tr>
    );
}

export default AdminRow;