import React, {useState} from 'react';
import { Button, useToast, Link, Text, HStack, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Divider, UnorderedList, ListItem } from '@chakra-ui/react';
import useColors from '../theming/useColors';
import { Link as RouterLink } from 'react-router-dom';
import { ii_supabase } from '../../constants/supabaseClient';
import { insert_ii_user } from '../api/ii_users';
import { insert_ii_user_courses } from '../api/ii_user_courses';
import { format_dow_schedule } from '../helpers/reception_days';

const PublicEnrollModal = ({ course, isOpen, onClose }) => {
    const course_name = course.display_name ? course.display_name : course.course_subject;
    const colors = useColors();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();


    const handleEnrollment = async () => {
        console.log('Enrolling in course', course.id);
        console.log('E-mail:', email);
        setIsLoading(true);
        try {
            // Step 1: Sign up the user with Supabase Auth
            const { data: authData, error: authError } = await ii_supabase.auth.signUp({
                email: email,
                password: password
            });
    
            if (authError) throw authError;

            if (!authData.user) throw new Error('User data not available');


            console.log(authData);
    
            const userId = authData.user.id;

            // Step 2: Insert user into ii_users table
            const new_data_to_send = {
                user_id: userId,
                email_address: email,
                user_tier: 'free',
                has_set_password: true, 
                current_audience:3,
                current_subject:123,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                reception_time: 7,
                dow_schedule: format_dow_schedule([],null),
                user_name: 'Anonymous',
                
            }

            const { result:userResult, message:userMessage, data: userData} = await insert_ii_user(new_data_to_send);
            /*const { data: userData, error: userError } = await ii_supabase
                .from('ii_users')
                .insert([
                    { id: userId, email: email }
                ]);
        */
            if (userResult==='error') {
                console.error(userMessage)
            }

            const user_course_data = {
                user_id: userId,
                course_id: course.id,
                dow_schedule: format_dow_schedule(['Mon','Wed','Fri'],null),
                latest_lesson: 0,
                reception_time: 7,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                is_paused: false,
                status: 1
            }

            const { result:ucResult, message:ucMessage, data: ucData} = await insert_ii_user_courses(user_course_data);
            // Step 3: Insert enrollment into ii_user_courses table
            {/*const { data: enrollmentData, error: enrollmentError } = await ii_supabase
                .from('ii_user_courses')
                .insert([
                    { user_id: userId, course_id: course.id }
                ]);
            */}
            if (ucResult==='error') { 
                console.error(ucMessage)
            }
    
            console.log('Enrollment successful!');
            toast({
                title: "Enrollment successful!",
                description: "Please check your e-mail and confirm via the link we just sent!",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            onClose(); // Close the modal after successful enrollment
            setIsLoading(false);
        } catch (error) {
            console.error('Error during enrollment:', error.message);
            // Handle the error (e.g., show an error message to the user)
        }

    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Enroll in {course_name}!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Add your modal content here */}
                    <Text mb={2}>E-mail:</Text>
                    <Input size="lg" placeholder="my_name@yahoo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Text mb={2}>Create a Password:</Text>
                    <Input type="password" size="lg" placeholder="Set a Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button colorScheme="teal" size="lg" width="100%" isDisabled={isLoading} marginTop={4} onClick={() => handleEnrollment()}>Enroll!</Button>
                    <Divider my={4} />
                    <UnorderedList>
                    <ListItem fontSize="sm" textColor={colors.text.context}>We'll send you an e-mail to confirm your address (be sure to check spam).</ListItem>
                    <ListItem fontSize="sm" textColor={colors.text.context}>Once confirmed, you'll be enrolled in the course and will start receiving e-mails on Monday, Wednesday, and Friday.</ListItem>
                    <ListItem fontSize="sm" textColor={colors.text.context}>By logging in, you can change your schedule and much more!</ListItem>
                    </UnorderedList>
                    <Divider my={4} />

                    <HStack alignItems="flex-start">
                        <Text>Already have an account?</Text>
                        <Link as={RouterLink} textColor={colors.text.teal} to="/">Log in here</Link>
                        </HStack>
                </ModalBody>
                <ModalFooter>
                    
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PublicEnrollModal;