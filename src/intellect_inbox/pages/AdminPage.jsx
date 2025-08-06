

import React, { useEffect } from 'react';
import { Text, Box, Center, VStack, Heading } from "@chakra-ui/react";
import HeaderBar from '../components/navigation/HeaderBar';
import MyHeader from '../../general/components/MyHeader';
import Footer from '../../general/components/Footer';
import { useIntellectInbox } from '../context/IntellectInboxContext';
import { ii_admin_fetch } from '../api/ii_admin_fetch';
import AdminTable from '../admin/AdminTable';
import CourseSection from '../courses/course_table/CourseSection';
import { useCourses } from '../context/CoursesContext';

function AdminPage() {
    const { inboxState, dispatch } = useIntellectInbox();
    const { state: courseState, dispatch: coursesDispatch } = useCourses();
    useEffect(() => {
        if(inboxState.user_tier !== 'admin') {
            return;
        }
        else {
            //Pull all lessons from the database
            ii_admin_fetch().then((data) => {
            dispatch({type: 'SET_ADMIN_DATA', payload: data})
            console.log(inboxState.admin_data)})
        }

    }, [inboxState.user_tier]);


    if(inboxState.user_tier !== 'admin' || inboxState.lesson_data.length === 0) {
        return (
            <Box>
                <MyHeader />
                <HeaderBar />
                <Center>
                    <VStack>
                        <Heading>Admin Page</Heading>
                        <Text>Sorry, you must be an admin to view this page.</Text>
                    </VStack>
                </Center>
                <Footer />
            </Box>
        );
    }


    return (
        <Box>
            <MyHeader />
            <HeaderBar />
            <Center px={2}>
                <VStack>
                <CourseSection />
                <AdminTable />
                </VStack>
        </Center>
        <Footer />
        </Box>
    );
}

export default AdminPage;