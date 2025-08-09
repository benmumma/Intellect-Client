import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, VStack, Input, useToast, Tooltip, Divider } from "@chakra-ui/react";
import SubjectSelector from '../selectors/SubjectSelector';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import AudienceSelector from '../selectors/AudienceSelector';
import { upsert_ii_user } from '../../api/ii_users';
import { upsert_ii_subject } from '../../api/ii_subjects';
import limits from '../../../constants/limits';


const PremiumScheduler = ({onClose}) => {
    const toast = useToast();
    const { inboxState, dispatch } = useIntellectInbox();

    const current_schedule = inboxState.dow_schedule;
    const user_tier = inboxState.user_tier;
    const is_premium = user_tier === 'premium' || user_tier === 'admin';
    const premium_days = Object.keys(current_schedule).filter(day => current_schedule[day].type === 'premium');
    const is_premium_schedule = premium_days.length > 0;
    //Let's get an array from Monday to Sunday of days on/off, topic, and audience.
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const days_on = daysOfWeek.map(day => current_schedule[day.substring(0,3)].type !== 'off');
    const subjects_on = daysOfWeek.map(day => current_schedule[day.substring(0,3)]?.subject || inboxState.current_subject);
    const audiences_on = daysOfWeek.map(day => current_schedule[day.substring(0,3)]?.audience || inboxState.current_audience);

    const [daysChosen, setDaysChosen] = useState(days_on);

    const [showCustom, setShowCustom] = useState(Array(7).fill(false));
    const [customValues, setCustomValues] = useState(Array(7).fill(''));

    const [subjects, setSubjects] = useState(inboxState.subject_options);
    const [subjectsChosen, setSubjectsChosen] = useState(is_premium_schedule ? subjects_on : Array(7).fill(inboxState.current_subject || 34));

    const [audiences, setAudiences] = useState(inboxState.audience_options);
    const [audiencesChosen, setAudiencesChosen] = useState(is_premium_schedule ? audiences_on : Array(7).fill(inboxState.current_audience || 2));

    const handleCustomClick = (index) => {
        const newShowCustom = [...showCustom];
        newShowCustom[index] = !newShowCustom[index];
        setShowCustom(newShowCustom);
    }

    const createNewTopic = async (index) => {
        // This will need to create a new topic and add it to the list of subjects.
        // For now, we'll just add a new topic with a random number.
        const new_subject_name = customValues[index];
        // Send this to the database to create a new subject.
        const data_to_send = {
            subject_name: new_subject_name,
            status: 1,
            private_user_id: inboxState.user_id,
            is_available: false,
            is_premium: true,
            is_aggregation: false,
            is_structured: false,
        };
        const { result, message, data } = await upsert_ii_subject(data_to_send);
        console.log(result);
        console.log(message);
        console.log(data);
    
        // Ensure the new subject data is available before proceeding
        if (!data || !data.id) {
            console.error('Failed to create new subject');
            return;
        }
    
        // Update state with the new subject.
        const new_subjects = [...subjects, data];
        dispatch({ type: 'SET_SUBJECT_OPTIONS', payload: new_subjects });
        setSubjects(new_subjects);
    
        // Wait for the state update to be completed
        await new Promise(resolve => setTimeout(resolve, 0));


    
        // Set as the current subject for that day.
        console.log(subjectsChosen)
        console.log(index)
        const newSubjectsChosen = [...subjectsChosen];
        newSubjectsChosen[index] = data.id;
        console.log(newSubjectsChosen);
        setSubjectsChosen(newSubjectsChosen);
    
        // Close the custom topic input.
        const newShowCustom = [...showCustom];
        newShowCustom[index] = false;
        setShowCustom(newShowCustom);
    
        // Show Toast
        toast({
            title: 'New Topic Created!',
            description: 'You can now select this topic for your schedule.',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };
    


    const handleSubmit = async (event) => {
        event.preventDefault();
        // This Needs to gather everything into a JSON object with one sub object for each day of the week as follows:
        //  "Fri": {
        //  "type": "standard" "premium" or "off"
        //  "subject": 34,
        //  "audience": 2
        //    },
        // And so on - one object for each day of the week, keyed off the first 3 letters of the day.
        let schedule = {};
        daysOfWeek.forEach((day, index) => {
            if(daysChosen[index]) {
                schedule[day.substring(0,3)] = {
                    type: 'premium',
                    subject: subjectsChosen[index],
                    audience: audiencesChosen[index]
                }
            }
            else {
                schedule[day.substring(0,3)] = {
                    type: 'off',
                    subject: subjectsChosen[index],
                    audience: audiencesChosen[index]
                }
            }
        });
        console.log(`Premium Scheduler Submitted`);
        console.log(schedule);
        //Now we'll need to send the schedule to update the dow_schedule in ii_users on the backend.
        //should be able to use upsert_ii_user_data to do this.
        let { result, message, data } = await upsert_ii_user({
            user_id: inboxState.user_id,
            dow_schedule: schedule,
        });
        if (result === 'success') {
            const new_data = {
                dow_schedule: schedule,
            }
            console.log(new_data);
            onClose();
            dispatch({ type: 'UPDATE_STATE', payload: new_data })
            toast({
                title: 'New Schedule saved!',
                description: 'You\'ll get your first e-mail soon!',
                status: 'success',
                duration: 6000,
                isClosable: true,
            });

        }
    }

    const toggleDay = (index) => {
        console.log('here');
        const newDaysChosen = [...daysChosen];
        newDaysChosen[index] = !newDaysChosen[index];
        setDaysChosen(newDaysChosen);
        console.log(newDaysChosen);
    }

    const limit_days = limits[user_tier].weekly_lessons;
    const days_chosen = daysChosen.filter(day => day).length;
       

    return (
        <Box as="form" onSubmit={handleSubmit} p={5} shadow="md" borderWidth="1px">
            {daysOfWeek.map((day, index) => {

                //console.log(subjectsChosen[index]);
            return(
            <FormControl key={day} isRequired>
                <FormLabel><b>{day}</b></FormLabel>
                <HStack alignItems="flex-start" flexDirection={{'base':'column','md':'row'}}>
                    <Button width="100%" colorScheme={daysChosen[index] ? 'teal' : 'gray'} onClick={() => toggleDay(index)}
                        isDisabled={days_chosen === limit_days && !daysChosen[index]}>
                        {daysChosen[index] ? 'On' : 'Off'}
                    </Button>
                    {daysChosen[index] && 
                    <VStack width="100%">
                    <SubjectSelector  width="100%" isDisabled={!daysChosen[index]} subjects={subjects} currentSubject={subjectsChosen} setCurrentSubject={setSubjectsChosen} index={index} mode="array_set"/>
                    {!showCustom[index] && 
                    <Tooltip label={is_premium ? "Create a custom subject on exactly what you want to learn!" : "Only premium members can create custom subjects!"}>
                    <Button  width="100%" colorScheme="teal" size="xs" variant="outline" onClick={() => handleCustomClick(index)} isDisabled={!is_premium}>
                        Build Custom Topic
                        </Button>
                        </Tooltip>}
                    {showCustom[index] && <FormControl>
                        <Input placeholder="Custom Topic" value={customValues[index]} onChange={(event) => { const newCustomValues = [...customValues]; newCustomValues[index] = event.target.value; setCustomValues(newCustomValues); }}/>
                        <Button colorScheme="teal" size="xs" variant="solid" mr={2} onClick={() => createNewTopic(index)}>Create</Button>
                        <Button colorScheme="teal" size="xs" variant="outline" onClick={() => handleCustomClick(index)}>Cancel</Button>
                    </FormControl>
                    }
                    </VStack>
                    }
                    {daysChosen[index] && <AudienceSelector width="100%" isDisabled={!daysChosen[index]} audiences={audiences} currentAudience={audiencesChosen} setCurrentAudience={setAudiencesChosen} index={index}  mode="array_set"/>}
                </HStack>
                <Divider my={2} />
                </FormControl>)
})
}
            <Button colorScheme="teal" type="submit" mt={6} width="100%">
                Update My Schedule!
            </Button>
        </Box>
    );
};

export default PremiumScheduler;