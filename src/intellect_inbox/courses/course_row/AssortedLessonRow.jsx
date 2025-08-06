// CourseRow.jsx
import React, { useState } from 'react';
import { Tr, Td, VStack, HStack, Heading, Icon, Collapse, Box, Text, useDisclosure, useMediaQuery,  Popover, PopoverTrigger, Button, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, IconButton, ButtonGroup, Divider} from '@chakra-ui/react';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import useColors from '../../theming/useColors';
import { useUsers } from '../../actions/useUsers';
import { AiFillBook, AiOutlineCaretDown, AiOutlineCaretRight, AiOutlineInfoCircle, AiOutlineUser } from 'react-icons/ai';
import AdHocLessonButton from '../../components/buttons/AdHocLessonButton';
import { FaPauseCircle, FaEdit, FaPlayCircle } from 'react-icons/fa';
import ScheduleVisualizer from '../../components/visuals/ScheduleVisualizer';
import { format_hour } from '../../helpers/datetimehelpers';
import PremiumSchedulerModal from '../../components/modals/PremiumSchedulerModal';
import { getNextScheduledDay } from '../../helpers/reception_days';
import { getAudience, getSubject } from '../../helpers/gets';
import GeneralLessonTable from '../../components/tables/GeneralLessonTable';
import EditSettingsModal from '../../components/modals/EditSettingsModal';
import EditSettingsForm from '../../components/forms/EditSettingsForm';

const ALActions = ({inboxState, buttonText, handleAssortedPause}) => {
    return (
        <ButtonGroup width="100%" as={HStack} justifyContent="flex-end">
                    <AdHocLessonButton buttonText={buttonText} flex="1" colorScheme="teal" size="sm"/>
                    <IconButton
                                colorScheme={inboxState.core_lessons_paused ? 'green' : 'yellow'}
                                variant="ghost"
                                size="sm"
                                icon={inboxState.core_lessons_paused ? <FaPlayCircle /> : <FaPauseCircle />}
                                onClick={() => handleAssortedPause()}
                            />
                    </ButtonGroup>
    )
}

const ALScheduler = ({inboxState, onPremiumOpen}) => {
    return ( <VStack alignItems="flex-start" width="100%">
        <ScheduleVisualizer course={null} dow_schedule={inboxState.dow_schedule} for_legacy_mode={true} />
        <HStack width="100%" justifyContent="space-between">
        <HStack>
        <Text>Sent @ </Text>
        <Popover>
            {({ onClose }) => (
                <>
                    <PopoverTrigger>
                        {/*<IconButton icon={<FaEdit />} size="sm" variant="ghost" color={colors.button.text} />*/}
                        <Text fontWeight="bold" cursor="pointer" _hover={{ textDecoration: 'underline' }}>{format_hour(inboxState.reception_time)}</Text>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Lesson Timing</PopoverHeader>
                        <PopoverBody>
                            <EditSettingsForm parameter_list={{'reception_time':true,'timezone':true}} onClose={onClose} display_mode = 'modal_form' />
                        </PopoverBody>
                    </PopoverContent>
                </>
            )}
        </Popover>
        </HStack>
        <Button colorScheme="teal" size="sm" variant="ghost" onClick={() => onPremiumOpen()}>Vary Subjects</Button>
        </HStack>
        </VStack>
    )
}

const AssortedLessonRow = () => {
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const [isMidScreen] = useMediaQuery("(max-width: 72em)");
    const buttonText = isMidScreen ? 'New' : 'New Lesson!';

    const tdPadding = isMobile ? 1 : isMidScreen ? 2 : 4;
    const [showLessons, setShowLessons] = useState(false);
    const { updateUserSchedule, pauseUserDailyLessons } = useUsers();
    const colors = useColors();
    const { inboxState } = useIntellectInbox();
    const toggleShowLessons = () => setShowLessons(!showLessons);
    //console.log(inboxState);
    const { isOpen: isPremiumOpen, onOpen: onPremiumOpen, onClose: onPremiumClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const handleAssortedPause = () => {
        console.log('Pausing assorted lesson');
        pauseUserDailyLessons({core_lessons_paused:!inboxState.core_lessons_paused});
    }
    const upcomingLesson = getNextScheduledDay({dow_schedule:inboxState.dow_schedule, reception_time:inboxState.reception_time, timezone:inboxState.timezone});
    let nextSubject = inboxState?.current_subject_object?.subject_name;
    let nextAudience = inboxState?.current_audience_object?.audience_name;

    if(upcomingLesson && upcomingLesson?.subject && upcomingLesson?.audience) {
        nextSubject = getSubject({current_subject:upcomingLesson?.subject, subject_options:inboxState?.subject_options})?.subject_name;
        nextAudience = getAudience({current_audience:upcomingLesson?.audience, audience_options:inboxState?.audience_options})?.audience_name;
    }
     
    const nextLessonDescription = upcomingLesson ? `${nextSubject} ${nextAudience}` : 'No lessons scheduled';
    const total_lessons = inboxState.lesson_data.filter((lesson) => lesson.course_id === null).length;
    const read_lessons = inboxState.lesson_data.filter((lesson) => lesson.course_id === null && lesson.is_read).length;
    const unread_lessons = total_lessons - read_lessons;


    
    return (
        <>
        <EditSettingsModal parameter_list={{'current_subject':true,'current_audience':true}} isOpen={isEditOpen} onClose={onEditClose} />
            <Tr key={-1}>
                <Td borderBottom="1px solid gray" padding={tdPadding}>
                    <VStack alignItems="flex-start" spacing={0}>
                        <HStack>
                            <VStack alignItems="flex-start">
                            <Box as={HStack}>
                            <Box as={HStack} cursor="pointer" onClick={toggleShowLessons}>
                                <Icon as={showLessons ? AiOutlineCaretDown : AiOutlineCaretRight} boxSize={4} color={colors.text.main} />
                                <Heading size="md" color={colors.text.main} _hover={{ textDecoration: 'underline' }}>
                                    My Daily Lessons
                                </Heading>
                            </Box>
                                <Popover>
                                <PopoverTrigger>
                                    <Button colorScheme="teal" size="md" variant="ghost"><AiOutlineInfoCircle /></Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Course Details</PopoverHeader>
                                    <PopoverBody>
                                        <Text mb={2}>In addition to courses, Intellect Inbox can provide you with assorted lessons on topics you care about in order to help you broaden your horizons! Those lessons will be aggregated here.</Text>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                                {inboxState.core_lessons_paused && <Icon as={FaPauseCircle} boxSize={4} color={colors.text.main} />}
                            </Box>
                            <HStack>
                            <Text ml={4} fontSize={isMobile ? 'sm':'sm'} textColor={colors.text.context}>Total: {total_lessons}</Text>
                            <Text fontSize={isMobile ? 'sm':'sm'}> | </Text>
                            <Text fontSize={isMobile ? 'sm':'sm'} fontWeight={unread_lessons > 0 ? 'bold' : 'normal'} textColor={unread_lessons > 0 ? colors.text.warning : colors.text.success}>Unread: {unread_lessons}</Text>
                            </HStack>
                            </VStack>
                            
                            
                        </HStack>
                        {isMobile &&  <><Divider my={1} /><ALScheduler inboxState={inboxState} onPremiumOpen={onPremiumOpen} /></>}
                        {isMobile &&  <><Divider my={1} /><ALActions inboxState={inboxState} handleAssortedPause={handleAssortedPause} /></>}
                        
                    </VStack>
                </Td>
                {!isMobile && <Td borderBottom="1px solid gray" padding={tdPadding}>
                    <VStack alignItems="flex-start" spacing={0} width="100%">
                        <HStack width="100%">
                        <Text fontSize="sm" textColor={colors.text.context}>My Default</Text>
                        <IconButton icon={<FaEdit />} size="sm" variant="ghost" color={colors.button.text} cursor="pointer" onClick={onEditOpen} />
                        </HStack>
                        <HStack>
                            <Icon as={AiFillBook} boxSize={4} color={colors.text.main} />
                            <Text>
                            {inboxState.current_subject_object.subject_name || ''}
                            </Text>
                    </HStack>
                    <HStack>
                            <Icon as={AiOutlineUser} boxSize={4} color={colors.text.main} />
                            <Text>
                            {inboxState.current_audience_object.audience_name || ''}
                            </Text>
                    </HStack>
                    </VStack>
                </Td>}
                {!isMobile && <Td borderBottom="1px solid gray" maxWidth="300px" padding={tdPadding}>
                    {inboxState.core_lessons_paused ? (<Text fontSize="lg" textColor={colors.text.context}>Core Lessons Paused</Text>) :
                    (<ALScheduler inboxState={inboxState} onPremiumOpen={onPremiumOpen} />)}
                </Td>}
                {!isMobile && !isMidScreen && <Td borderBottom="1px solid gray" padding={tdPadding}>
                {inboxState.core_lessons_paused ? 
                                    (<Text></Text>) : 
                                    (<VStack alignItems="flex-start">
                                        <Text>
                                    Next: {upcomingLesson ? upcomingLesson?.day : ''} @ {format_hour(inboxState.reception_time)}
                                    </Text>
                                    <Text>
                                    Topic:&nbsp;
                                    {nextLessonDescription}
                                     </Text>
                                    
                                    </VStack>) 
                }
                </Td>}
                {!isMobile && <Td borderBottom="1px solid gray" padding={tdPadding}>
                    <ALActions inboxState={inboxState} buttonText={buttonText} handleAssortedPause={handleAssortedPause} />
                </Td>}
            </Tr>
            <PremiumSchedulerModal isOpen={isPremiumOpen} onClose={onPremiumClose} />
            <Tr key={`$general-lessons`}>
                <Td colSpan="5" padding={0} borderBottom="1px solid" borderColor={colors.border.main}>
                    <Collapse in={showLessons} animateOpacity>
                        <Box padding={tdPadding} background={colors.bg.darker} borderRadius="md">
                            <GeneralLessonTable lessons={inboxState.lesson_data.filter((lesson) => lesson.course_id === null)} course_id={null} />
                        </Box>
                    </Collapse>
                </Td>
            </Tr>
        </>
    );
};

export default AssortedLessonRow;