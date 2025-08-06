
// CourseSchedule.jsx
import React, {useState} from 'react';
import { Td, VStack, Text, HStack, IconButton, Button, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody } from '@chakra-ui/react';
import { make_reception_string } from '../../helpers/reception_days'
import { format_hour } from '../../helpers/datetimehelpers';
import CourseTiming from './CourseTiming';
import useColors from '../../theming/useColors';
import ScheduleVisualizer from '../../components/visuals/ScheduleVisualizer';

const CourseSchedule = ({ course, isMobile, status, ...props}) => {
    const schedule = make_reception_string(course.ii_user_courses[0].dow_schedule);
    const reception_time = course.ii_user_courses[0].reception_time;
    const timezone = course.ii_user_courses[0].timezone;
    const [editView, setEditView] = useState(null);
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const colors = useColors();
    const toggleEditView = (view) => {
        if(editView === view) {
            setEditView(null);
        }
        else {
            setEditView(view);
        }
    }
    if(status === 'Completed!' || status === 'Deleted') {
        return <Td borderBottom={isMobile ? "": "1px solid gray"} {...props}>
            <Text textColor={colors.text.context} fontStyle="oblique">N/A</Text>
        </Td>
    }

    return (
        <Td borderBottom={isMobile ? "": "1px solid gray"} {...props}>
            <VStack alignItems="flex-start" width="100%">
                <VStack alignItems="flex-start" width="100%">
                    <ScheduleVisualizer course={course} dow_schedule={course.ii_user_courses[0].dow_schedule} status={status} />
                <HStack width="100%">
                    <Text textColor={status === 'Paused' ? colors.text.context : colors.text.main}>Sent @ </Text>
                    <Popover>
                        {({ onClose }) => (
                            <>
                                <PopoverTrigger>
                                    {/*<IconButton icon={<FaEdit />} size="sm" variant="ghost" color={colors.button.text} />*/}
                                    <Text fontWeight="bold"  textColor={status === 'Paused' ? colors.text.context : colors.text.main} cursor="pointer" _hover={{ textDecoration: 'underline' }}>{format_hour(reception_time)}</Text>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Lesson Timing</PopoverHeader>
                                    <PopoverBody>
                                        <CourseTiming course={course} toggleEditView={toggleEditView} onClose={onClose} />
                                    </PopoverBody>
                                </PopoverContent>
                            </>
                        )}
                    </Popover>
                </HStack>
                </VStack>
            </VStack>
        </Td>
    );
};

export default CourseSchedule;