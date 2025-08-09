import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Heading, Text, Center, VStack, HStack, Button, Divider, Link, useDisclosure, useMediaQuery, Tooltip, IconButton, useToast} from '@chakra-ui/react';
import { ii_supabase } from '../../constants/supabaseClient';
import MyHeader from '../../general/components/MyHeader';
import useColors from '../theming/useColors';
import CourseLevelVisualizer from '../components/visuals/CourseLevelVisualizer';
import CourseLengthVisualizer from '../components/visuals/CourseLengthVisualizer';
import TeacherVisualizer from '../components/visuals/TeacherVisualizer';
import Footer from '../../general/components/Footer';
import { FaArrowLeft, FaShare } from 'react-icons/fa';
import limits from '../../constants/limits';
import PublicEnrollModal from './PublicEnrollModal';
import CurriculumTable from '../components/tables/CurriculumTable';
import RatingVisualizer from '../components/visuals/RatingVisualizer';
import { useIntellectInbox } from '../context/IntellectInboxContext';
import { useUserCourses } from '../actions/useUserCourses';
import { MANAGE_ACCOUNT_URL } from '../../constants/constants.js';

const PublicCoursePage = () => {
    const { course_id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [courseName, setCourseName] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const colors = useColors();
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const toast = useToast();
    const { inboxState } = useIntellectInbox();
    const { enrollInCourse } = useUserCourses();

    const handleShareClick = (course_id) => {
        const course_url = `${window.location.origin}/course/${course_id}`;
        navigator.clipboard.writeText(course_url);
        toast({
            title: 'Link Copied',
            description: 'The course link has been copied to your clipboard',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleEnrollClick = () => {
        if (inboxState.user_id && inboxState.userStatus === 'signed_in') {
            //TODO:
            //Enroll the user in the course if possible
            enrollInCourse({ course_id: course_id });
        } else {
            onOpen(); //Have user sign up
        }
    }


   
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const { data, error } = await ii_supabase
                    .from('ii_courses')
                    .select(`*,
                        ii_instructors (name, description, image_url, status),
                        ii_levels (level_id, name)
                        `)
                    .eq('id', course_id)
                    .eq('is_listed', true)
                    .single();

                if (error) {
                    throw new Error(error.message);
                }
                console.log(data);

                setCourseData(data);
                setCourseName(data.display_name ? data.display_name : data.course_subject)
            } catch (error) {
                console.error(error);
            }
        };

        fetchCourseData();
    }, [course_id]);

    return (
        <>
        <MyHeader />
        <Center>
        <VStack width="100%" padding={8} bg={colors.bg.contrast}>
            {courseData ? (
                <>
                    <HStack width="100%" spacing={4}>
                        <Link as={RouterLink} to="/courses" color="teal"><HStack><FaArrowLeft /><Text>All</Text></HStack></Link>
                        <VStack flex="1" alignItems="flex-start">
                    <Heading flex="1" size={isMobile ? 'md' : 'lg'}>{courseName}</Heading>
                    {!isMobile && <Text>{courseData.course_description}</Text>}
                    <RatingVisualizer total_rating={courseData.total_rating} total_reviews={courseData.total_reviews} />
                    </VStack>
                    <VStack>
                    <Button colorScheme="teal" size="lg" onClick={() => handleEnrollClick()}>{isMobile ? 'Enroll' : 'Enroll Today!'}</Button>
                    <HStack>
                    <Text fontSize="sm">Free Course</Text>
                    <Tooltip label="Share">
                        <IconButton
                            colorScheme="teal"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShareClick(course_id)}
                            icon={<FaShare />}
                        />
                    </Tooltip>
                    </HStack>
                    
                    </VStack>
                    </HStack>
                    {isMobile && <Text fontSize="sm">{courseData.course_description}</Text>}
                    <HStack width="100%" p={8} justifyContent="space-between"  flexDir={isMobile ? 'column' : 'row'}>
                        <VStack spacing={0}>
                        <CourseLevelVisualizer level={courseData.course_level} />
                        <Text textColor={colors.text.context}>Level: {courseData?.ii_levels?.name}</Text>
                        </VStack>
                        <VStack spacing={0}>
                        <CourseLengthVisualizer days={courseData.course_length} />
                        <Text textColor={colors.text.context}>Length: {courseData.course_length} days</Text>
                        </VStack>
                        <TeacherVisualizer teacher_data={courseData.ii_instructors} />
                        <VStack spacing={0}>
                            <Text>Language:</Text>
                            <Text>{courseData.language}</Text>
                        </VStack>
                    </HStack>
                    <HStack width="100%" alignItems="flex-start" spacing={8} flexDir={isMobile ? 'column' : 'row'}>
                        <CurriculumTable curriculum={courseData.curriculum} flex="2"/>
                   
                <VStack alignItems="flex-start" flex="1">
                <Heading size="md">Q&A</Heading>
                <Divider my={4} />
                {inboxState.user_id && inboxState.userStatus === 'signed_in' ? <Text>Welcome, you are logged in as: {inboxState.email_address}</Text> : null}
                    <Heading size="sm">How do courses work?</Heading>
                    <Text>Intellect Inbox courses are made for you each morning by our hardworking AI! Choose your schedule and get a daily e-mail straight to your inbox!</Text>
                    <Divider py={2} />
                    <Heading size="sm">How much does it cost?</Heading>
                    <Text>Our courses are free to take!</Text>
                    <Divider py={2} />
                    <Heading size="sm">What else can I learn?</Heading>
                    <Text>We offer a vast array of free courses that you can take after <b>{courseData.display_name}</b>!</Text>
                    <Text>In addition, you can create your own personalized course on any subject you'd like!*</Text>
                    <Divider py={2} />
                    <Heading size="sm">How customizable are the courses?</Heading>
                    <Text>They can be extremely tailored and focused! You choose the subject, the length, the teacher, the language, and more!</Text>
                    <Text>You can even describe your goals for the course, specific circumstances, and what you already know. The AI will tailor the course around that!</Text>
                    <Divider py={2} />
                    <Text fontStyle="oblique">* Free users can create up to {limits.free.personalized_courses} personalized course. Upgrade to Premium for <b>$1.99/month</b> to create more. <Link href={MANAGE_ACCOUNT_URL} color="teal.500" isExternal>Manage Account</Link></Text>
                </VStack>
                </HStack>
                <PublicEnrollModal isOpen={isOpen} onClose={onClose} course={courseData} />
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </VStack>
        </Center>
        <Footer />
        </>
    );
};

export default PublicCoursePage;