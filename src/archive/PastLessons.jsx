import React, { useState } from 'react';
import { useIntellectInbox } from '../intellect_inbox/context/IntellectInboxContext';
import { Table, Thead, Tbody, Tr, Th, Td, Button, VStack, Box, Heading, Text, HStack, Input, Link, IconButton, Tooltip } from "@chakra-ui/react";
import { Link as ReachLink } from 'react-router-dom';
import RatingButton from '../intellect_inbox/buttons/RatingButton';
import { ii_supabase } from '../constants/supabaseClient';
import  Pagination from '../intellect_inbox/components/tables/Pagination';
import SubjectSelector from '../intellect_inbox/components/SubjectSelector';
import AudienceSelector from '../intellect_inbox/components/AudienceSelector';
import FlagButton from '../intellect_inbox/components/FlagButton';
import ReadButton from '../intellect_inbox/components/ReadButton';
import NotesComponent from '../intellect_inbox/components/NotesComponent';
import { AiFillCheckCircle, AiFillEdit, AiFillFlag } from 'react-icons/ai';
import { FaDiscourse } from 'react-icons/fa';

const PastLessons = () => {
    const { inboxState, dispatch } = useIntellectInbox();
    const isMobile = window.innerWidth < 768;
    const [searchText, setSearchText] = useState('');
    const [currentSubject, setCurrentSubject] = useState(-1);
    const [currentAudience, setCurrentAudience] = useState(-1);
    const [flagFilter, setFlagFilter] = useState(-1);
    const [readFilter, setReadFilter] = useState(-1);
    const [noteFilter, setNoteFilter] = useState(-1);
    const [threadFilter, setThreadFilter] = useState(-1);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(50); // You can adjust the number of items per page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const total_lessons_ever = inboxState.lesson_data.length;

    const handleReadFilterSwitch = (filterType) => {

        if(filterType === 'flag') {
            console.log('adding flag filter')
            setFlagFilter(flagFilter+1);
            if(flagFilter === 1) {
                setFlagFilter(-1)
            }
        }
        if(filterType === 'read') {
            setReadFilter(readFilter+1);
            if(readFilter === 1) {
                setReadFilter(-1);
            }
        }
        if(filterType === 'note') {
            setNoteFilter(noteFilter+1);
            if(noteFilter === 1) {
                setNoteFilter(-1);
            }
        }
        if(filterType === 'chat') {
            setThreadFilter(threadFilter+1);
            if(threadFilter === 1) {
                setThreadFilter(-1);
            }
        }
    };

    const updateRating = async (post_id, rating) => {
        dispatch({
            type: 'UPDATE_RATING',
            payload: { post_id, rating }
        });

        const { error } = await ii_supabase.from('ii_user_posts').upsert({
            post_id,
            user_id: inboxState.user_id,
            rating
        });

        if (error) {
            console.error('Error updating rating:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    };

    const handleAudienceSwitch = (e) => {
        setCurrentAudience(e);
        setCurrentPage(1);
    };
    const handleSubjectSwitch = (e) => {
        setCurrentSubject(e);
        setCurrentPage(1);
    };

    const filteredLessons = inboxState.lesson_data.filter((lesson) => {
        let subject_match = true;
        let audience_match = true;
        let string_match = true;
        let flag_match = true;
        let read_match = true;
        let note_match = true;
        let thread_match = true;
        let is_aggregation = inboxState.subject_options.filter((subject) => subject.id === currentSubject)[0]?.is_aggregation;
        let aggregation_list = inboxState.subject_options.filter((subject) => subject.id === currentSubject)[0]?.aggregation_list;
        if (currentSubject !== -1) {
            if (is_aggregation) {
                subject_match = aggregation_list.includes(lesson.subject_id) || lesson.subject_id === currentSubject;
            } else
            {
            subject_match = lesson.subject_id === currentSubject;
            }
        }
        if (currentAudience !== -1) {
            audience_match = lesson.audience_id === currentAudience;
        }
        if(flagFilter !== -1) {
            if(flagFilter === 0) {
                flag_match = lesson.is_flagged === false;
            }
            if(flagFilter === 1) {
                flag_match = lesson.is_flagged === true;
            }
        }
        if(readFilter !== -1) {
            if(readFilter === 0) {
                read_match = lesson.is_read === false;
            }
            if(readFilter === 1) {
                read_match = lesson.is_read === true;
            }
        }
        if(noteFilter !== -1) {
            if(noteFilter === 0) {
                note_match = lesson.notes === null;
            }
            if(noteFilter === 1) {
                note_match = lesson.notes !== null;
            }
            
        }
        if(threadFilter !== -1) {
            let hasThreads = lesson.thread_id !== null;
            if(threadFilter === 0) {
                thread_match = !hasThreads;
            }
            if(threadFilter === 1) {
                thread_match = hasThreads;
            }
        }
        if(searchText !== '') {
            const string_to_search = lesson.post_name.toLowerCase() + lesson.subject_name.toLowerCase() + lesson.audience_name.toLowerCase() + (lesson.notes !== null ? lesson.notes.toLowerCase() : '');
            string_match = string_to_search.includes(searchText.toLowerCase());
        }
        return subject_match && audience_match && string_match && flag_match && read_match && note_match && thread_match;
    });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = (filteredLessons && filteredLessons !== null && filteredLessons.length > 0) ? filteredLessons.slice(indexOfFirstItem, indexOfLastItem) : [];


    const renderLessonRow = (lesson) => (
        <Tr key={lesson.id} maxHeight="200px">
            <Td>
                <HStack>
                    <Button size="sm" colorScheme="teal" as={ReachLink} to={"/intellectinbox/lesson/" + lesson.id}>View</Button>
                <VStack alignItems="flex-start" spacing={0}>
                    <Link as={ReachLink} to={"/intellectinbox/lesson/" + lesson.id} fontWeight="bold">{lesson.post_name}</Link>
                    <Text fontSize="sm" textColor="gray">Version: {lesson.version}</Text>
                </VStack>
                </HStack>
            </Td>
            <Td>
                {new Date(lesson.created_at).toLocaleDateString() + ' ' + new Date(lesson.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </Td>
            <Td>
                {lesson.course_id === null && <Text>{lesson.subject_name + ' ' + lesson.audience_name}</Text>}
                {lesson.course_id !== null && <Text>{lesson.course_subject + ' Lesson '+lesson.order_id+' of '+lesson.course_length}</Text>}
            </Td>
            <Td>
                <RatingButton postId={lesson.id} currentRating={lesson.rating} updateRating={updateRating} />
            </Td>
            <Td>
                <FlagButton user_id={inboxState.user_id} post_id={lesson.id} is_flagged={lesson.is_flagged} />
                </Td>
                <Td>
                <ReadButton user_id={inboxState.user_id} post_id={lesson.id} is_read={lesson.is_read} />
                </Td>
                <Td>
                <HStack>
                <NotesComponent user_id={inboxState.user_id} post_id={lesson.id} notes={lesson.notes} />
                {lesson.thread_id === null ? '' : <FaDiscourse color="green" />}
                </HStack>
            </Td>
        </Tr>
    );

    if (!isMobile) {
        return (
            <>
                {total_lessons_ever > 0 && (<HStack mb={4} width="100%" px={{'base':1,'xl':2}}>
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleSearch}
                    />
                    <SubjectSelector subjects={inboxState.subject_options} currentSubject={currentSubject} setCurrentSubject={handleSubjectSwitch} include_any={true} />
                    <AudienceSelector audiences={inboxState.audience_options} currentAudience={currentAudience} setCurrentAudience={handleAudienceSwitch} include_any={true} />
                    <IconButton icon={<AiFillFlag />} 
                                variant="outline" 
                                onClick={() => handleReadFilterSwitch('flag')} 
                                color={flagFilter === -1 ? 'gray' : flagFilter === 0 ? 'black' : 'red'} />
                    <IconButton icon={<AiFillCheckCircle />} 
                                variant="outline" 
                                onClick={() => handleReadFilterSwitch('read')} 
                                color={readFilter === -1 ? 'gray' : readFilter === 0 ? 'black' : 'green'}
                                    />
                    <IconButton icon={<AiFillEdit />} variant="outline" onClick={() => handleReadFilterSwitch('note')}
                                color={noteFilter === -1 ? 'gray' : noteFilter === 0 ? 'black' : 'green'}

                     />
                    <IconButton icon={<FaDiscourse />} variant="outline" onClick={() => handleReadFilterSwitch('chat')}
                                color={threadFilter === -1 ? 'gray' : threadFilter === 0 ? 'black' : 'green'}
                                />

                </HStack>
                )}
                <Table variant="simple" width="100%" px={{'base':1,'xl':2}}>
                    <Thead>
                        <Tr key="header-of-table">
                            <Th>Lesson Name</Th>
                            <Th>Date Received</Th>
                            <Th>Topic/Audience</Th>
                            <Th>My Rating</Th>
                            <Th>Flag</Th>
                            <Th>Complete</Th>
                            <Th>Notes</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentItems.length === 0 && (
                            <Tr maxHeight="200px">
                                <Td colSpan="5">No lessons found - click "New Lesson" to get one!</Td>
                            </Tr>
                        )}
                        {total_lessons_ever === 0 && (
                            <Tr maxHeight="800px">
                                <Td colSpan="5">
                                Also, click the "Edit" icons at the top of the screen to customize your settings!
                                </Td>
                            </Tr>
                        )}
                        {currentItems.map(renderLessonRow)}
                    </Tbody>
                </Table>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredLessons.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </>
        );
    } else {
        return (
            <>
                {total_lessons_ever > 0 && (<VStack spacing={1} mb={4}>
                    <SubjectSelector subjects={inboxState.subject_options} currentSubject={currentSubject} setCurrentSubject={handleSubjectSwitch} include_any={true} />
                    <AudienceSelector audiences={inboxState.audience_options} currentAudience={currentAudience} setCurrentAudience={handleAudienceSwitch} include_any={true} />
                    <HStack>
                        <IconButton icon={<AiFillFlag />}
                                    variant="outline"
                                    onClick={() => handleReadFilterSwitch('flag')}
                                    color={flagFilter === -1 ? 'gray' : flagFilter === 0 ? 'black' : 'red'} />
                        <IconButton icon={<AiFillCheckCircle />}
                                    variant="outline"
                                    onClick={() => handleReadFilterSwitch('read')}
                                    color={readFilter === -1 ? 'gray' : readFilter === 0 ? 'black' : 'green'}
                        />
                        <IconButton icon={<AiFillEdit />} variant="outline" onClick={() => handleReadFilterSwitch('note')}
                                    color={noteFilter === -1 ? 'gray' : noteFilter === 0 ? 'black' : 'green'}
                        />
                        <IconButton icon={<FaDiscourse />} variant="outline" onClick={() => handleReadFilterSwitch('chat')}
                                    color={threadFilter === -1 ? 'gray' : threadFilter === 0 ? 'black' : 'green'}
                        />
                    </HStack>
                </VStack>)}
                <VStack width="100%" alignContent="stretch" justifyContent="stretch">
                    {currentItems.length === 0 && <Box p={2} borderWidth="1px" borderRadius="lg" m={1} flex="1" width="100%">
                        No lessons found - click "+ New" to get one!
                        </Box>}
                    {total_lessons_ever === 0 && (
                            <Box p={2} borderWidth="1px" borderRadius="lg" m={1} flex="1" width="100%">
                                Also, click the "Edit" icon at the top of the screen to customize your settings!
                                </Box>
                        )}
                    {currentItems.map((lesson) => (
                        <Box key={lesson.id} p={2} borderWidth="1px" borderRadius="lg" m={1} flex="1" width="100%" maxHeight="200px">
                            <Heading size="md" as={ReachLink} to={"/intellectinbox/lesson/" + lesson.id}>{lesson.post_name}</Heading>
                            <Text>{new Date(lesson.created_at).toLocaleString()}</Text>
                            <Text>{lesson.subject_name + ' ' + lesson.audience_name}</Text>
                            <HStack justifyContent="space-between">
                                <RatingButton postId={lesson.id} currentRating={lesson.rating} updateRating={updateRating} />
                                <FlagButton user_id={inboxState.user_id} post_id={lesson.id} is_flagged={lesson.is_flagged} />
                                <ReadButton user_id={inboxState.user_id} post_id={lesson.id} is_read={lesson.is_read} />
                                <Button m={1}
                                    colorScheme="teal"
                                    size="sm"
                                    as={ReachLink} to={"/intellectinbox/lesson/" + lesson.id}>View</Button>
                            </HStack>
                            <NotesComponent user_id={inboxState.user_id} post_id={lesson.id} notes={lesson.notes} />
                        </Box>
                    ))}
                </VStack>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredLessons.length}
                    paginate={paginate}
                    currentPage={currentPage} />
            </>
        );
    }
};

export default PastLessons;
