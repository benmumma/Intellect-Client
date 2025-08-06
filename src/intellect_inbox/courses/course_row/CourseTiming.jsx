import React, {useState} from 'react';
import { FormControl, HStack, VStack, Text, FormLabel, Select, useColorModeValue, Button} from '@chakra-ui/react';
import hoursArray from '../../../constants/hoursArray';
import commonTimezones from '../../../constants/commonTimezones';
import {useUserCourses} from '../../actions/useUserCourses';

const CourseTiming = ({course, toggleEditView, onClose}) => {
    const user_course = course.ii_user_courses[0];
    const [hour, setHour] = useState(user_course.reception_time || 9);
    const [timezone, setTimezone] = useState(user_course.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
    const inputBg = useColorModeValue('gray.100', 'gray.700');
    const inputBgSelected = useColorModeValue('white', 'gray.800');
    const {updateCourseTiming} = useUserCourses();


    const handleTimingUpdate = () => {
        //Update database and reducer
        updateCourseTiming({course_id:course.id, reception_time:hour, timezone:timezone});
        toggleEditView();
        onClose()
    }

    
    return (
    <FormControl isRequired>
                <VStack alignItems="flex-start" p={2} border="1px solid teal" boxShadow="md" mb={3}>
                    <Text fontSize="xs">What time do you want new lessons?</Text>
                    <HStack alignItems="baseline" width="100%">
                        <FormLabel htmlFor="hour">Hour</FormLabel>
                        <Select id="hour"
                            borderRadius={0}
                            backgroundColor={inputBg}
                            placeholder="Select hour" value={hour} onChange={e => setHour(e.target.value)} _focus={{ backgroundColor: inputBgSelected }}>
                            {hoursArray.map(({ label, value }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </HStack>
                    <FormControl isRequired>
                        <HStack alignItems="baseline">
                        <Select id="timezone"
                            borderRadius={0}
                            backgroundColor={inputBg}
                            placeholder="Select timezone" value={timezone} onChange={e => setTimezone(e.target.value)} _focus={{ backgroundColor: inputBgSelected }}>
                            {commonTimezones.map(({ label, value }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </Select>
                    </HStack>
                    <Button colorScheme="teal" size="sm" onClick={() => handleTimingUpdate()} width="100%" mt={2}>Save</Button>
                    </FormControl>
                </VStack>
            </FormControl>
    )
};

export default CourseTiming;