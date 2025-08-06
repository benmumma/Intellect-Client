import React, { useEffect } from 'react';
import { useToast, Text, Box, Table, Thead, Tr, Th, Td, Tbody, HStack, VStack, Button , Select, Input} from "@chakra-ui/react";
import { useIntellectInbox } from '../context/IntellectInboxContext';
import AdminRow from './AdminRow';
import Pagination from '../components/tables/Pagination';
import SubjectSelector from '../components/selectors/SubjectSelector';
import AudienceSelector from '../components/selectors/AudienceSelector';
function AdminTable() {
    const { inboxState, dispatch } = useIntellectInbox(); 

    const [topicFilter, setTopicFilter] = React.useState('');
    const [audienceFilter, setAudienceFilter] = React.useState(-1);
    const [subjectSelectFilter, setSubjectSelectFilter] = React.useState(-1);
    const [statusFilter, setStatusFilter] = React.useState('');
    const [sentFilter, setSentFilter] = React.useState('');
    const [ratingFilter, setRatingFilter] = React.useState('');
    const [ratingValueFilter, setRatingValueFilter] = React.useState('');
    const [threadFilter, setThreadFilter] = React.useState('');
    const [displayedLessons, setDisplayedLessons] = React.useState(inboxState.admin_data || []);


    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(50); // You can adjust the number of items per page

    useEffect(() => {
        setDisplayedLessons(inboxState.admin_data || []);
    }, [inboxState.admin_data]);

    const filter_lessons = () => {
        if(!inboxState.admin_data || inboxState.admin_data.length === 0) {
            return;
        }
        let subject_is_aggregation = inboxState.subject_options.some((subject) => subject.id === subjectSelectFilter && subject.is_aggregation);
        let subject_agg_list = inboxState.subject_options.filter((subject) => subject.id === subjectSelectFilter).map((subject) => subject.aggregation_list)[0] || [];
        console.log(subject_agg_list);

        let filteredLessons = inboxState.admin_data.filter((lesson) => {
            let topicMatch = true;
            let audienceMatch = true;
            let statusMatch = true;
            let subjectMatch = true;
            let sentMatch = true;
            let ratingMatch = true;
            let ratingValueMatch = true;
            let threadMatch = true;

            let post_name = lesson?.post_name?.toLowerCase() || '';
  

            if(topicFilter) {
                topicMatch = post_name.toLowerCase().includes(topicFilter.toLowerCase());
            }
            if(audienceFilter > 0) {
                audienceMatch = parseInt(lesson.audience_id) === parseInt(audienceFilter);
            }
            if(statusFilter) {
                statusMatch = parseInt(lesson.status) === parseInt(statusFilter);
            }
            if(subjectSelectFilter > 0) {
                if(!subject_is_aggregation) {
                subjectMatch = lesson?.subject_id === subjectSelectFilter;
                }
                else {
                    //Check if the subject_id of the lesson is in the aggregation_list
                    subjectMatch = subject_agg_list.includes(lesson?.subject_id);
                }
            }
            if(sentFilter) {
                //SentFilter will be a string with > or < followed by a number
                let operator = sentFilter[0];
                let number = parseInt(sentFilter.slice(1));
                let sent_count = lesson?.ii_user_posts?.length || 0;
                if(operator === '>') {
                    sentMatch = sent_count >= number;
                }
                else if(operator === '<') {
                    sentMatch = sent_count <= number;
                }


            }
            if(ratingFilter) {
                //ratingMatch = lesson?.ii_user_posts.some((post) => post.rating > 0);
                let operator = ratingFilter[0];
                let number = parseInt(ratingFilter.slice(1));
                let rated_count = lesson.ii_user_posts.filter((post) => post.rating > 0).length;
                if(operator === '>') {
                    ratingMatch = rated_count >= number;
                }
                else if(operator === '<') {
                    ratingMatch = rated_count <= number;
                }
            }
            if(ratingValueFilter) {
                //ratingMatch = lesson?.ii_user_posts.some((post) => post.rating > 0);
                let operator = ratingValueFilter[0];
                let number = parseInt(ratingValueFilter.slice(1));
                let rated_count = lesson.ii_user_posts.filter((post) => post.rating > 0).length;
                let sum_ratings = lesson.ii_user_posts.reduce((acc, post) => acc + post.rating, 0);
                let average_rating = rated_count > 0 ? sum_ratings / rated_count : 0;
                //let sum_ratings = lesson.ii_user_posts.reduce((acc, post) => acc + parseFloat(post.rating), 0);
                console.log(average_rating);
                if(operator === '>' && parseFloat(average_rating) > 0) {
                    console.log(parseFloat(average_rating));
                    ratingValueMatch = parseFloat(average_rating) >= parseFloat(number);
                }
                else if(operator === '<' && parseFloat(average_rating) > 0) {
                    ratingValueMatch = parseFloat(average_rating) <= parseFloat(number);
                }
                else {
                    ratingValueMatch = false;
                
                }
            }
            if(threadFilter) {
                //threadMatch = lesson?.ii_user_posts.some((post) => post.thread_id);
                let operator = threadFilter[0];
                let number = parseInt(threadFilter.slice(1));
                let thread_count = lesson.ii_user_posts.filter((post) => post.thread_id).length;
                if(operator === '>') {
                    threadMatch = thread_count >= number;
                }
                else if(operator === '<') {
                    threadMatch = thread_count <= number;
                }
            }

            return topicMatch && audienceMatch && statusMatch && subjectMatch && sentMatch && ratingMatch && threadMatch && ratingValueMatch;
        });

        setDisplayedLessons(filteredLessons || []);
        setCurrentPage(1);
    }

    if(!inboxState.admin_data) {
        return (
            <Box>
                <Text>Loading...</Text>
            </Box>
        );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = (displayedLessons && displayedLessons !== null && displayedLessons.length > 0) ? displayedLessons.slice(indexOfFirstItem, indexOfLastItem) : [];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <VStack>
        <HStack>
            <Text>Filter by:</Text>
            <VStack alignItems="flex-start">
            <Text>Topic:</Text>
            <Input type="text" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} />
            </VStack>
            <VStack alignItems="flex-start">
            <Text>Audience:</Text>
            <AudienceSelector audiences={inboxState.audience_options} currentAudience={audienceFilter} setCurrentAudience={setAudienceFilter} include_any={true} />
            </VStack>
            <VStack alignItems="flex-start">
            <Text>Status:</Text>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All</option>
                <option value="1">Active</option>
                <option value="3">Deleted</option>
            </Select>
            </VStack>
            <VStack alignItems="flex-start">
            <Text>Subject:</Text>
            <SubjectSelector subjects={inboxState.subject_options} currentSubject={subjectSelectFilter} setCurrentSubject={setSubjectSelectFilter} include_any={true} />
            </VStack>
            <VStack alignItems="flex-start">
            <Text>Sent:</Text>
            <Input type="text" value={sentFilter} onChange={(e) => setSentFilter(e.target.value)} />
            </VStack>
            <VStack alignItems="flex-start">
            <Text>Rated:</Text>
            <Input type="text" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} />
            </VStack>
            <VStack alignItems="flex-start">
            <Text>Thread:</Text>
            <Input type="text" value={threadFilter} onChange={(e) => setThreadFilter(e.target.value)} />
            </VStack>
            <VStack alignItems="flex-start">
            <Text>Rating:</Text>
            <Input type="text" value={ratingValueFilter} onChange={(e) => setRatingValueFilter(e.target.value)} />
            </VStack>
            <Button onClick={() => filter_lessons()}>Filter</Button>
        </HStack>
        <Text>Showing {currentItems.length} of {displayedLessons.length} lessons</Text>
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Lesson ID</Th>
                    <Th>Lesson Name</Th>
                    <Th>Status</Th>
                    <Th>Subject/Audience</Th>
                    <Th>Version Links</Th>
                    <Th>Ratings</Th>
                    <Th>Edit</Th>
                </Tr>
            </Thead>
            <Tbody>
                
                {currentItems.length === 0 ? <Tr><Td colSpan="7">No Lessons Found!</Td></Tr> : currentItems.map((lesson) => (
                    <AdminRow lesson={lesson} key={lesson.id}/>
                ))}
            </Tbody>
        </Table>
        <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={displayedLessons.length}
            paginate={paginate}
            currentPage={currentPage}
        />
        </VStack>
    );
}

export default AdminTable;
