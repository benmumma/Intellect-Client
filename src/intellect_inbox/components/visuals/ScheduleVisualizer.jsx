// CourseSchedule.jsx
import React, {useState, useEffect} from 'react';
import { Flex, Box, Button, Tooltip } from '@chakra-ui/react';
import { make_reception_string, format_reception_days} from '../../helpers/reception_days'
import limits from '../../../constants/limits';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import { useUserCourses } from '../../actions/useUserCourses';
import { useUsers } from '../../actions/useUsers';
import useColors from '../../theming/useColors';

const ScheduleVisualizer = ({ course, dow_schedule, for_legacy_mode=false, status="Active" }) => {
    const {inboxState} = useIntellectInbox();
    const user_tier = inboxState.user_tier;
    let my_limits = limits[user_tier].weekly_course_lessons;
    if(for_legacy_mode) {
      my_limits = limits[user_tier].weekly_lessons;
    }
    const {updateCourseSchedule} = useUserCourses();
    const {updateUserSchedule} = useUsers();
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const initialDays = format_reception_days(dow_schedule) || [];
    const [receptionDays, setReceptionDays] = useState(initialDays);
    const colors = useColors();

    // Keep local state in sync if the provided schedule changes
    useEffect(() => {
      setReceptionDays(format_reception_days(dow_schedule) || []);
    }, [dow_schedule]);

    const toggleDay = (day) => {
  console.log('Toggling day:', day)
  
  setReceptionDays(prevDays => {
    let newDays;
    if (prevDays.includes(day)) {
      newDays = prevDays.filter(d => d !== day);
    } else {
      newDays = [...prevDays, day];
    }
    
    // Perform database update after state has been updated
    if (!for_legacy_mode) {
      updateCourseSchedule({ course_id: course.id, reception_days: newDays });
    } else if (for_legacy_mode) {
      updateUserSchedule({ reception_days: newDays });
    }
    
    return newDays;
  });
}

    return (
                    <Flex width="100%">
                        {weekdays.map(day => {
                          const isDisabled = (receptionDays.length === my_limits && !receptionDays.includes(day)) || status === 'Paused' || status === 'Completed!' || status === 'Deleted';
                            return (
                          <Tooltip key={day} label={isDisabled ? 'You can only receive this '+my_limits+' times per week':'Send e-mails on '+day} aria-label="A tooltip">
                            <Button
                            key={day}
                            flex="1"
                            height="30px"
                            minWidth="20px"
                            maxWidth="60px"
                            margin="2px"
                            bgColor={receptionDays.includes(day) ? colors.bg.teal : colors.bg.gray}
                            textColor={receptionDays.includes(day) ? 'white' : 'black'}
                            isDisabled= {isDisabled}
                            opacity={1}
                            borderRadius="6px"
                            transition="transform 0.2s"
                            boxShadow={receptionDays.includes(day) ? "0px 0px 5px 0px rgba(0,0,0,0.75)" : 'sm'}
                            padding={"0px !important"}
                            _hover={{ transform: 'scale(1.1)', bgColor: receptionDays.includes(day) ? colors.bg.teal : colors.bg.gray}}
                            textAlign={'center'}
                            fontSize="xs"
                            onClick={() => toggleDay(day)}
                            cursor="pointer"
                          >
                            {(day==="Thu"|| day==="Sun" || day==="Sat")? day.substring(0,2) : day.substring(0,1)}
                          </Button>
                          </Tooltip>
                        )
                        }
                        )}
                    </Flex>
    );
};

export default ScheduleVisualizer;