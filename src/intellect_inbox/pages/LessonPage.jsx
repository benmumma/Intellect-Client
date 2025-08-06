import React, { useEffect, useState } from 'react';
import { useToast, Text, Box, Center, VStack, Heading, Divider, Button, HStack, useMediaQuery } from "@chakra-ui/react";

import { ii_supabase } from '../../constants/supabaseClient';
import { useIntellectInbox } from '../context/IntellectInboxContext';
import { useCourses } from '../context/CoursesContext';
import { useParams } from 'react-router-dom';

import MyHeader from '../../general/components/MyHeader';
import Footer from '../../general/components/Footer';
import {useNavigate} from 'react-router-dom';
import LessonHeaderBar from '../lesson_page/LessonHeaderBar';
import RatingButton from '../components/buttons/RatingButton';
import FlagButton from '../components/interactions/FlagButton';
import ReadButton from '../components/interactions/ReadButton';
import NotesComponent from '../components/interactions/NotesComponent';
import HighlightMenu from '../lesson_page/HighlightMenu';
import MarkdownRenderer from '../lesson_page/MarkdownRenderer';
import InteractiveLearning from '../lesson_page/InteractiveLearning';
import LessonCourseNav from '../lesson_page/LessonCourseNav';
import TeacherVisualizer from '../components/visuals/TeacherVisualizer';


function LessonPage() {
    const { loadingSession, userLoaded, inboxState, dispatch } = useIntellectInbox();
    const { state: coursesState } = useCourses();
    const {lessonId} = useParams()
    const toast = useToast();
    const [lessonData, setLessonData] = useState(null);
    const [thisLesson, setThisLesson] = useState(null);
    const [results, setResults] = useState(null);
    const [audience, setAudience] = useState('');

    const [isMobile] = useMediaQuery("(max-width: 48em)");
    //const [isMidScreen] = useMediaQuery("(max-width: 72em)");

    const navigate = useNavigate();
    const chatDisabled = inboxState.user_tier === 'standard' ? true : false;
    const bucketName = 'ii_lessons';

    const thisCourse = coursesState.courses.find(course => course.id === thisLesson?.course_id);
    const courseName = thisCourse?.course_subject || '';
    const displayName = thisCourse?.display_name || '';
    const realDisplay = displayName === '' ? courseName : displayName;


    useEffect(() => {
        console.log('Changing Lesson: updating session id');
        const sessionId = thisLesson?.session_id || null;
        dispatch({ type: 'UPDATE_LIVE_SESSION_ID', payload: sessionId });
        console.log('Session ID:', sessionId);
        
    }, [thisLesson]);


    useEffect(() => {
        if (lessonId && userLoaded && inboxState.lesson_data.length > 0) {
            console.log('Finding Lesson');
            //console.log(inboxState.lesson_data);
            const lesson = inboxState.lesson_data.find(lesson => parseInt(lesson.id) === parseInt(lessonId));
            //console.log(lesson);
            if(lesson) {
            setThisLesson(lesson);
            setAudience(lesson?.audience_name || '');

            //console.log(thisLesson);
            }
            else {
                console.log('Main Redirect');
                setResults('No Lesson Found.')
                toast({
                    title: "Lesson not found",
                    description: "Sign in or select a different lesson!",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                navigate('/intellectinbox')
            }
              
        }
    }, [lessonId, userLoaded, inboxState.lesson_data]);
    
    useEffect(() => {
        async function fetchLessonData() {
            if (!thisLesson) {
                return
            };
            console.log('Fetching lesson data');
            const latest_version = thisLesson.ii_post_versions.filter(version => version.post_version === thisLesson.version);
            const shortFilePath = latest_version[0].post_url.split('/' + bucketName + '')[1];

            try {
                const { data, error } = await ii_supabase.storage
                    .from(bucketName)
                    .download(shortFilePath);

                if (error) {
                    console.error('Error fetching lesson data:', error);
                    setResults('Error');
                } else {
                    const textContent = await data.text();
                    const replacedContent = textContent.replace(/Rumpelstiltskin/g, inboxState.user_name);
                    setLessonData(replacedContent);
                    setResults('Success');
                }
            } catch (error) {
                console.error('Error fetching lesson data:', error);
                setResults('Error')
            }
            
        }

        if (!loadingSession && userLoaded) {
            if (lessonId) {
                fetchLessonData();
                console.log(results);
                if(results === 'No Lesson Found.') {
                    toast({
                        title: "Lesson not found",
                        description: "Sign in or select a different lesson!",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                    navigate('/intellectinbox');
                }
            } 
        }
    }, [thisLesson, lessonId, loadingSession, userLoaded, inboxState.user_name, bucketName, toast, navigate]);

    



    const updateRating = async (post_id, rating) => {
        //console.log(rating);
        //Update the lesson data in the state
        dispatch({  type: 'UPDATE_RATING',
                    payload: {post_id: post_id, rating: rating} });
        const { data, error } = await ii_supabase.from('ii_user_posts').upsert({
            post_id: post_id,
            user_id: inboxState.user_id,
            rating: rating
        });
        if (error) {
            console.error('Error updating rating:', error);
        } else {
            console.log('Rating updated:', data);
        }
    }
    if (loadingSession || !lessonData) {
        return <div>Loading...</div>;
    }



    return (
        <Box>
            <MyHeader />
            <LessonHeaderBar lesson={thisLesson} setLesson={setThisLesson} />
            <LessonCourseNav thisLesson={thisLesson} />
            <Center px={2}>
                <VStack px={isMobile ? '2':'6'} spacing={{'base':2,'xl':8}} width="100%" maxWidth="2000px" alignItems="flex-start" flexDirection={{'base':'column','xl':'row'}}>
                    <Box flex={2}>
                        <VStack width="100%" alignItems="flex-start">
                        <Heading as="h1" size="lg" my={2}>{thisLesson?.post_name}</Heading>
                        <HStack width="100%" justifyContent="space-between">
                        {thisLesson?.course_id !== null && <TeacherVisualizer teacher_data={thisCourse?.ii_instructors} custom_override={thisCourse.custom_instructor_details} />}
                            <VStack width="100%" alignItems="flex-start">
                        <HStack width="100%" justifyContent="space-between">
                            {thisLesson?.course_id === null && <Text fontStyle="italic" size="sm">{thisLesson?.subject_name} {audience}</Text>}
                            {thisLesson?.course_id !== null && <Text fontStyle="italic" size="sm">{realDisplay}</Text>}
                            <Text>{thisLesson?.created_at && new Date(thisLesson.created_at).toLocaleString()}</Text>
                            <RatingButton 
                                key={`rating-${thisLesson?.id}`}
                                postId={thisLesson?.id} 
                                currentRating={thisLesson?.rating} 
                                updateRating={updateRating} 
                            />
                        </HStack>
                        <HStack width="100%" justifyContent="space-between" mt={1}>
                            <NotesComponent 
                                key={`notes-${thisLesson?.id}`}
                                user_id={inboxState.user_id} 
                                post_id={lessonId} 
                                notes={thisLesson?.notes} 
                                flex="1" 
                            />
                            <Box>
                                <FlagButton 
                                    key={`flag-${thisLesson?.id}`}
                                    user_id={inboxState.user_id} 
                                    post_id={lessonId}  
                                    is_flagged={thisLesson?.is_flagged} 
                                />
                                <ReadButton 
                                    key={`read-${thisLesson?.id}`}
                                    user_id={inboxState.user_id} 
                                    post_id={lessonId} 
                                    is_read={thisLesson?.is_read} 
                                />
                            </Box>
                        </HStack>
                        </VStack>
                        </HStack>
                        </VStack>
                        <Divider py={2} />
                        <MarkdownRenderer content={lessonData} />
                        {!chatDisabled && <HighlightMenu lessonId={thisLesson?.id} thisLesson={thisLesson} />}
                        <Divider my={2} />
                    </Box>
                    <InteractiveLearning thisLesson={thisLesson} audience={audience} />
                </VStack>
            </Center>
            <Footer />
        </Box>
    );
}

export default LessonPage;