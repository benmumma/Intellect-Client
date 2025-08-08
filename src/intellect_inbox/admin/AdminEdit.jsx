import React, {useEffect} from 'react';
import { useToast, Text, Select, HStack, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Divider, Textarea } from "@chakra-ui/react";
import { useIntellectInbox } from '../context/IntellectInboxContext';
import { upsert_ii_post } from '../api/ii_posts';
import { ii_supabase } from '../../constants/supabaseClient';
import SubjectSelector from '../components/selectors/SubjectSelector';
import AudienceSelector from '../components/selectors/AudienceSelector';

// Select bucket name based on env toggle
const useNewInstance = process.env.REACT_APP_USE_NEW_SUPABASE === 'true';
const bucketName = useNewInstance ? 'ii-lessons' : 'ii_lessons';

function AdminEdit({lesson}) {
    const { inboxState, dispatch } = useIntellectInbox(); 
    const [lessonText, setLessonText] = React.useState('');
    const {isOpen, onOpen, onClose} = useDisclosure();
    const toast = useToast();

    const [postTitle, setPostTitle] = React.useState(lesson.post_name);
    const [lessonStatus, setLessonStatus] = React.useState(lesson.status);
    const [currentSubject, setCurrentSubject] = React.useState(lesson?.ii_subjects?.id || null);
    const [currentAudience, setCurrentAudience] = React.useState(lesson?.ii_audiences?.id || null);

    const pull_lesson_data = async (cacheBust=false) => {
        const lessonData = await fetchLessonData(lesson, cacheBust);
        //console.log(lessonData);
        setLessonText(lessonData);
    }

    const update_lesson_data = async () => {
        console.log('Updating lesson data');
        const shortFilePath = lesson.post_url.split('/' + bucketName + '/')[1];
        console.log(shortFilePath);
        const newLessonText = lessonText;
        console.log(newLessonText)
        const { data, error } = await ii_supabase.storage
            .from(bucketName)
            .upload(shortFilePath, newLessonText, {
                contentType: 'text/plain',
                upsert: true,
            });
            
            
        if (error) {
            console.error('Error updating lesson data:', error);
            return;
        }
        else {
            console.log('Lesson data updated:', data);
            toast({
                title: 'Lesson Updated',
                description: 'The lesson has been updated.',
                status: 'success',  
                duration: 2000,
                isClosable: true,
            });
        }
    }

    const handleOnOpen = async () => {
        onOpen();
        pull_lesson_data();
    }


    const postUpsert = async(data_to_upsert) => {
        const {result, message,data} =  await upsert_ii_post(data_to_upsert);
        if(result === 'error') {
            console.error('Error updating post:', message);
            return;
        }
        console.log('Post updated:', data);
        toast({
            title: 'Post Updated',
            description: 'The post has been updated.',
            status: 'success',  
            duration: 2000,
            isClosable: true,
        });
    }

    const postRename = async () => {
        const new_name = postTitle;
        const id = lesson.id;
        //Now we want to update ii_posts with the new name
        const data_to_upsert = {
            id: id,
            post_name: new_name
        }
        await postUpsert(data_to_upsert);
    }

    const postStatusUpdate = async () => {
        const data_to_upsert = {
            id: lesson.id,
            status: lessonStatus
        }
        await postUpsert(data_to_upsert);
    }

    const postSubjectUpdate = async () => {
        const data_to_upsert = {
            id: lesson.id,
            subject_id: currentSubject
        }
        await postUpsert(data_to_upsert);
    }

    const postAudienceUpdate = async () => {
        const data_to_upsert = {
            id: lesson.id,
            audience_id: currentAudience
        }
        await postUpsert(data_to_upsert);
    
    }






    async function fetchLessonData(thisLesson, cacheBust=false) {
        console.log('Fetching lesson data');
        console.log(thisLesson);
        if (!thisLesson) {
            return
        };
        console.log('Fetching lesson data');
        const shortFilePath = thisLesson.post_url.split('/' + bucketName + '')[1]+(cacheBust ? '?'+Date.now() : '');
        try {
            const { data, error } = await ii_supabase.storage
                .from(bucketName)
                .download(shortFilePath);

            if (error) {
                console.error('Error fetching lesson data:', error);
                return 'Error';
            } else {
                const textContent = await data.text();
                return textContent;
            }
        } catch (error) {
            console.error('Error fetching lesson data:', error);
            return 'Error';
        }
    }


    
    return (
        <>
        <Button colorScheme="teal" onClick={()=> handleOnOpen()}>Edit</Button>
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit {lesson.post_name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <HStack>
                    <Text>Post Title:</Text>
                    <Input placeholder="Edit Post Name" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                    <Button colorScheme="teal" onClick={() => postRename()}>Save</Button>
                    </HStack>
                    <Divider my={4} />
                    <HStack>
                    <Text>Post Status:</Text>
                    {/*<Input placeholder="Edit Post Status" value={lessonStatus} onChange={(e) => setLessonStatus(e.target.value)} />*/}
                    <Select value={lessonStatus} onChange={(e) => setLessonStatus(e.target.value)}>
                        <option value="1">Active</option>
                        <option value="3">Deleted</option>
                    </Select>
                    <Button colorScheme="teal" onClick={() => postStatusUpdate()}>Save</Button>
                    </HStack>
                    <Divider my={4} />

                    <HStack>
                        <Text>Subject: </Text>
                        <SubjectSelector subjects={inboxState.subject_options} currentSubject={currentSubject} setCurrentSubject={setCurrentSubject} />
                        <Button colorScheme="teal" onClick={() => postSubjectUpdate()}>Save</Button>
                    </HStack>
                    <Divider my={4} />
                    <HStack>
                        <Text>Audience: </Text>
                        <AudienceSelector audiences={inboxState.audience_options} currentAudience={currentAudience} setCurrentAudience={setCurrentAudience}/>
                        <Button colorScheme="teal" onClick={() => postAudienceUpdate()}>Save</Button>
                    </HStack>
                    <Divider my={4} />
                    <HStack mb={2} justifyContent="space-between">
                    <Text>Latest Lesson</Text>
                    </HStack>
                    <Textarea value={lessonText}  height={'30vh'} onChange={(e) => setLessonText(e.target.value)}/>
                    <HStack justifyContent="space-between">
                    <Button colorScheme="teal" onClick={() => pull_lesson_data(true)}>Refresh</Button>
                    <Button colorScheme="teal" onClick={() => update_lesson_data()}>Save</Button>
                    </HStack>
                    
                </ModalBody>

                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
}

export default AdminEdit;