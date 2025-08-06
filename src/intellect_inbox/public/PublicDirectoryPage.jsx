import React from 'react';
import { Box, Text} from '@chakra-ui/react';
import MyHeader from '../../general/components/MyHeader';
import Footer from '../../general/components/Footer';
import PublicCourseDirectory from './PublicCourseDirectory';
import { useIntellectInbox } from '../context/IntellectInboxContext';

const PublicDirectoryPage = () => {
    const { inboxState } = useIntellectInbox();

   
    return (
        <Box>
            <MyHeader />
            {inboxState.user_id && inboxState.userStatus === 'signed_in' ? <Text>Welcome, you are logged in as: {inboxState.email_address}</Text> : null}
            <PublicCourseDirectory  />
            
            <Footer />
        </Box>
    );
};

export default PublicDirectoryPage;