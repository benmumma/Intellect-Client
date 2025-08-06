import React, { useState } from 'react';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Input,
    Select,
    Text,
    HStack, VStack,
    useToast,
    useColorModeValue,
} from '@chakra-ui/react';
import { upsert_ii_user } from '../../api/ii_users';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import {format_dow_schedule, format_reception_days} from '../../helpers/reception_days';
import SubjectSelector from '../selectors/SubjectSelector';
import AudienceSelector from '../selectors/AudienceSelector';
import commonTimezones from '../../../constants/commonTimezones';
import hoursArray from '../../../constants/hoursArray';
import limits from '../../../constants/limits';

const EditSettingsForm = ({ parameter_list, onClose, display_mode = 'modal_form' }) => {

    const toast = useToast();
    const { inboxState, dispatch } = useIntellectInbox();
    const user_id = inboxState.user_id;
    const email = inboxState.email_address;
    const user_tier = inboxState.user_tier;
    const [name, setName] = React.useState(inboxState.user_name);
    const [currentSubject, setCurrentSubject] = React.useState(inboxState.current_subject || 123);
    const [currentAudience, setCurrentAudience] = React.useState(inboxState.current_audience || 2);
    const [hour, setHour] = useState(inboxState.reception_time || 9);
    const [timezone, setTimezone] = useState(inboxState.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [subjects, setSubjects] = useState(inboxState.subject_options);
    const [audiences, setAudiences] = useState(inboxState.audience_options);

    const inputBg = useColorModeValue('gray.100', 'gray.600');
    const inputBgSelected = useColorModeValue('teal.100', 'teal.600');


    const [receptionDays, setReceptionDays] = useState(format_reception_days(inboxState?.dow_schedule) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    const toggleDay = (day) => {
        if (receptionDays.includes(day)) {
            setReceptionDays(receptionDays.filter(d => d !== day));
        } else {
            setReceptionDays([...receptionDays, day]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle form submission here
        console.log('Submitting form...');

        console.log(receptionDays);
        const dow_schedule = format_dow_schedule(receptionDays, inboxState.dow_schedule);
        console.log(dow_schedule);

        const new_subject_object = inboxState.subject_options.find(subject => parseInt(subject.id) === parseInt(currentSubject));

        const new_audience_object = inboxState.audience_options.find(audience => parseInt(audience.id) === parseInt(currentAudience));

        const data_to_update = {
            user_id: user_id,
            email_address: email,
            user_name: name,
            reception_time: hour,
            timezone: timezone,
            current_subject: currentSubject,
            current_audience: currentAudience,
            dow_schedule: dow_schedule,
        }
        //if (user_tier === 'standard') {
        //    data_to_update.dow_schedule = dow_schedule;
        //}


        let { result, message, data } = await upsert_ii_user(data_to_update);
        if (result === 'success') {
            //setUserSignedUp(true);
            //dispatch({ type: 'UPDATE_USER', payload:  });
            const new_data = {
                user_name: name,
                current_subject: currentSubject,
                current_audience: currentAudience,
                current_subject_object: new_subject_object,
                current_audience_object: new_audience_object,
                reception_time: hour,
                timezone: timezone,
                userSignedUp: true,
                dow_schedule: dow_schedule,
            }
            //if (user_tier === 'standard') {
            //    new_data.dow_schedule = dow_schedule;
            //}
            console.log(new_data);
            onClose();
            dispatch({ type: 'UPDATE_STATE', payload: new_data })
            toast({
                title: 'User details saved!',
                description: 'You\'ll get your first e-mail soon!',
                status: 'success',
                duration: 6000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'An error occurred.',
                description: message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };


    return (
        <Box as="form" onSubmit={handleSubmit}>
            {display_mode === 'new_user' &&
                <>
                    <Text fontStyle="oblique">Please provide a couple quick details to finalize your setup!</Text>
                    <Divider my={3} />
                </>
            }
            {parameter_list?.email_address &&
                <FormControl isDisabled>
                    <VStack width="100%" alignItems="flex-start" p={2} border="1px solid teal" boxShadow="md" mb={3}>
                        <Text fontSize="xs">You'll receive e-mails to this address:</Text>

                        <HStack width="100%" alignItems="baseline">
                            <FormLabel>E-mail Address</FormLabel>
                            <Input borderRadius={0} variant="ghost" flex="1" value={email} _focus={{ backgroundColor: inputBgSelected }} />
                        </HStack>
                    </VStack>
                </FormControl>}
            {parameter_list?.user_name && <FormControl isRequired>
                <VStack width="100%" alignItems="flex-start" p={2} border="1px solid teal" boxShadow="md" mb={3}>
                    <Text fontSize="xs">Who should the e-mails be addressed to?</Text>
                    <HStack width="100%" alignItems="baseline">
                        <FormLabel>Name</FormLabel>
                        <Input placeholder="Your Name"
                            variant="ghost"
                            borderRadius={0}
                            backgroundColor={inputBg}
                            value={name} onChange={(e) => setName(e.target.value)}
                            _focus={{ backgroundColor: inputBgSelected }} />
                    </HStack>

                </VStack>
            </FormControl>}

            {parameter_list?.current_subject &&
                <FormControl mt={4} isRequired>
                    <VStack width="100%" alignItems="flex-start" p={2} border="1px solid teal" boxShadow="md" mb={3}>
                        <Text fontSize="xs">Choose a topic you want to learn about!</Text>
                        <HStack width="100%" alignItems="baseline">
                            <SubjectSelector subjects={subjects} currentSubject={currentSubject} setCurrentSubject={setCurrentSubject} />
                        </HStack>
                    </VStack>

                </FormControl>}


            {parameter_list?.current_audience &&
                <FormControl mt={4} isRequired>
                    <VStack width="100%" alignItems="flex-start" p={2} border="1px solid teal" boxShadow="md" mb={3}>
                        <Text fontSize="xs">How should the e-mails be written?</Text>
                        <HStack width="100%" alignItems="baseline">
                            <AudienceSelector audiences={audiences} currentAudience={currentAudience} setCurrentAudience={setCurrentAudience} />
                        </HStack>
                    </VStack>
                </FormControl>}

                {parameter_list?.reception_days && <FormControl isRequired>
                <VStack width="100%" alignItems="flex-start" p={2} border="1px solid teal" boxShadow="md" mb={3}>
                    <Text fontSize="xs">Which days do you want to receive Intellect Inbox?</Text>
                    <Text fontSize="xs">Your account can receive Intellect Inbox up to {limits[inboxState.user_tier].weekly_lessons} days per week!</Text>
                    <HStack width="100%" alignItems="baseline">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'].map((day, index) => (
                            <Button key={index} 
                                    colorScheme={receptionDays.includes(day) ? 'teal' : 'gray'} 
                                    color={receptionDays.includes(day) ? 'white' : 'gray.400'}
                                    onClick={() => toggleDay(day)}
                                    size= {{'base':'sm','md':'md'}}
                                    isDisabled= {receptionDays.length === limits[user_tier].weekly_lessons && !receptionDays.includes(day)}
                                    fontSize={{'base':'xs','md':'md'}}>
                                {day}
                            </Button>
                        ))}
                    </HStack>
                    <Text fontSize="xs">
                        You'll receive Intellect Inbox on {receptionDays.join(', ')}.
                            </Text>
                </VStack>
            </FormControl>}



            {parameter_list?.reception_time && <FormControl isRequired>
                <VStack width="100%" alignItems="flex-start" p={2} border="1px solid teal" boxShadow="md" mb={3}>
                    <Text fontSize="xs">What time do you want to receive Intellect Inbox?</Text>
                    <HStack width="100%" alignItems="baseline">
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
                    {parameter_list?.timezone && <FormControl isRequired>
                        <HStack width="100%" alignItems="baseline">
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
                    </FormControl>}
                </VStack>
            </FormControl>}

            

            <Button colorScheme="teal" mt={4} type="submit" width="100%">
                {display_mode === 'modal_form' ? 'Save' : ''}
                {display_mode === 'new_user' ? 'Let\'s Go!' : ''}
            </Button>
        </Box>
    );
}

export default EditSettingsForm;