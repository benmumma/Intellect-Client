import { Button, useToast, Text, VStack, useDisclosure, 
  Modal, ModalHeader, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalFooter,
Heading, HStack, Divider, Spinner,
ButtonGroup,
Input, } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { useIntellectInbox } from '../../context/IntellectInboxContext';
import SubjectSelector from '../selectors/SubjectSelector';
import AudienceSelector from '../selectors/AudienceSelector';
import { API_BASE_URL } from '../../../constants/constants';
import { read_ii_user_posts_v2 } from '../../api/ii_user_posts';
import limits from '../../../constants/limits';

function AdHocLessonButton({ buttonText="New Lesson!", ...props }) {
  const { inboxState, dispatch } = useIntellectInbox();
  const toast = useToast();
  const isMobile = window.innerWidth < 600;


  const [loading, setLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState(inboxState.last_email);
  const [withinOneHour, setWithinOneHour] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  
  let timeLimit = limits[inboxState.user_tier].cooldown*60;

  const tl_mili = timeLimit * 60 * 1000;

  
  useEffect(() => {
    setLastEmail(inboxState.last_email);
  }, [inboxState.last_email]);

  useEffect(() => {
    if (inboxState && inboxState.lesson_data && lastEmail) {
      setWithinOneHour((new Date() - new Date(lastEmail)) < tl_mili);
      setIsDisabled(withinOneHour);
      setTimeLeft(Math.floor((tl_mili - (new Date() - new Date(lastEmail))) / 60000));
    }
    if (inboxState && inboxState.lesson_data && inboxState.lesson_data.length === 0) {
      setIsDisabled(false);
    }
  }, [lastEmail, withinOneHour]);

    //Update the timeLeft and withinOneHour every minute
    useEffect(() => {
      const interval = setInterval(() => {
        setTimeLeft(Math.floor((tl_mili - (new Date() - new Date(lastEmail))) / 60000));
        setWithinOneHour((new Date() - new Date(lastEmail)) < tl_mili);
      }, 60000);
      return () => clearInterval(interval);
    }, [lastEmail]);


    const handleDisappointment = () => {
      toast({
        title: "Hold your horses!",
        description: "You can get one lesson every "+timeLimit+" minutes.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const canLearnAnythingNow = (inboxState.user_tier === 'premium' || inboxState.user_tier === 'admin') ? true : false;
  const [buttonSelected, setButtonSelected] = useState(1);
  const [currentSubject, setCurrentSubject] = useState(inboxState.current_subject || 123);
  const [currentAudience, setCurrentAudience] = useState(inboxState.current_audience || 2);
  const [learnAnythingNow, setLearnAnythingNow] = useState('');
  const [subjectOverride, setSubjectOverride] = useState(123);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  }

  const handleGenerateLesson = async () => {
    //Need to check to obey time limits
    if(isDisabled) {
      handleDisappointment();
      return;
    }
    //Need to handle each buttonSelected case
    let data_to_send = {};
    let send_url = API_BASE_URL + 'intellectinbox/testFullProcess';
    if(buttonSelected === 1) {
      data_to_send = {
        user_id: inboxState.user_id,
        subject_object: inboxState.current_subject_object,
        audience_object: inboxState.current_audience_object,
        email_address: inboxState.email_address,
        user_name: inboxState.user_name
      };
    }
    else if(buttonSelected === 2) {
      const new_subject_object = inboxState.subject_options.find((subject) => subject.id === currentSubject);
      const new_audience_object = inboxState.audience_options.find((audience) => audience.id === currentAudience);
      data_to_send = {
        user_id: inboxState.user_id,
        subject_object: new_subject_object,
        audience_object: new_audience_object,
        email_address: inboxState.email_address,
        user_name: inboxState.user_name
      };
    }
    else if(buttonSelected === 3) {
      const new_audience_object = inboxState.audience_options.find((audience) => audience.id === currentAudience);
      data_to_send = {
        user_id: inboxState.user_id,
        audience_object: new_audience_object,
        email_address: inboxState.email_address,
        user_name: inboxState.user_name,
        topic_to_learn: learnAnythingNow,
        additional_instructions: additionalInstructions

      };
      if(inboxState.user_tier === 'admin') {
        console.log('Admin Lesson-to-Subject!')
        console.log(subjectOverride);
        const new_subject_object = inboxState.subject_options.find((subject) => subject.id === subjectOverride);
        console.log(new_subject_object);
        data_to_send.subject_object_override = new_subject_object;
      }
      send_url = API_BASE_URL + 'intellectinbox/learnAnythingNow';
    }

    try {
      //Disable the button while sending emails
      setLoading(true);
      setIsDisabled(true);
      //Close Modal as we work
       onClose();
      console.log('Data to send:', data_to_send)
      const response = await fetch(send_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers here
        },
        body: JSON.stringify(data_to_send),
        // You might need to include credentials: 'include' if your backend requires authentication
      });
      const data = await response.json();
      console.log(data.message);
      setLoading(false);
      toast({
        title: "New lesson made!!",
        description: "See it here + we've sent an email to " + inboxState.email_address,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setLastEmail(new Date());
      dispatch({ type: 'UPDATE_LAST_EMAIL', payload: new Date() });
      console.log(lastEmail);
      setIsDisabled(true);
      //Pull the latest lesson and add it to the top of the state
      const new_lesson = await read_ii_user_posts_v2({user_id: inboxState.user_id, limit_param: 1});
      console.log(new_lesson);
      dispatch({ type: 'ADD_NEW_LESSON', payload: new_lesson[0] });

    } catch (error) {
      console.error("Failed to send emails:", error);
      //alert("Failed to send emails.");
      toast({
        title: "Error",
        description: "Failed to send emails.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

  }

  const handleMethodSwap = (method) => {
    setButtonSelected(method);
  }

  return (
    <>
    <Button onClick={onOpen} isDisabled={loading} {...props}>
    {loading ? <HStack><Spinner size="md" />{!isMobile && <Text fontSize="sm">We're working!</Text>}</HStack> : buttonText}
    </Button>
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent>
        <ModalHeader>Get an Ad Hoc Lesson!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Divider mb={4} />
            <HStack width="100%" my={2}>
                <Button flex="2" fontSize={isMobile ? 'xs' : 'md'} colorScheme={buttonSelected === 1 ? 'teal' : 'gray'} onClick={() => handleMethodSwap(1)}>My Default</Button>
                <Button flex="2" fontSize={isMobile ? 'xs' : 'md'} colorScheme={buttonSelected === 2 ? 'teal' : 'gray'} onClick={() => handleMethodSwap(2)}>Another Subject</Button>
                <Button flex="3" fontSize={isMobile ? 'xs' : 'md'} isDisabled={!canLearnAnythingNow} colorScheme={buttonSelected === 3 ? 'teal' : 'gray'} onClick={() => handleMethodSwap(3)}>
                  <VStack spacing={1}>
                  <Text>Learn Anything Now</Text>
                  <Text fontSize={isMobile ? '2xs' : 'xs'} fontStyle="oblique">Premium Only</Text>
                  </VStack>
                  </Button>
            </HStack>
            <Divider mb={4} />
            {/*Display the appropriate form based on the buttonSelected state*/}
            {buttonSelected === 1 && 
            <Text my={2}>Your Default Subject is: <b>{inboxState.current_subject_object.subject_name} {inboxState.current_audience_object.audience_name}</b></Text>
            }
            {buttonSelected === 2 &&
            <VStack spacing={2}>
            <Text my={2}>Get a lesson within one of our other subjects:</Text>
            <SubjectSelector subjects={inboxState.subject_options} currentSubject={currentSubject} setCurrentSubject={setCurrentSubject}/>
            <AudienceSelector audiences={inboxState.audience_options} currentAudience={currentAudience} setCurrentAudience={setCurrentAudience} />
            </VStack>
            }
            {buttonSelected === 3 &&
            <VStack spacing={2}>
            <Text my={2}>Get a single lesson on any topic you can imagine!</Text>
            <Input placeholder="Enter a topic!" value={learnAnythingNow} onChange={(e) => setLearnAnythingNow(e.target.value)} />
            <AudienceSelector audiences={inboxState.audience_options} currentAudience={currentAudience} setCurrentAudience={setCurrentAudience} />
            {inboxState.user_tier === 'admin' && 
            <>
            <Button onClick={handleToggleAdvanced} size="sm" colorScheme="teal" variant="link">
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
          {showAdvanced && (
            <>
              {/* Advanced content goes here */}
              <Input placeholder="Additional Instructions?" value={additionalInstructions} onChange={(e) => setAdditionalInstructions(e.target.value)} />
              <Text>Set Subject</Text>
              <SubjectSelector
                subjects={inboxState.subject_options}
                currentSubject={subjectOverride}
                setCurrentSubject={setSubjectOverride}
              />
            </>
          )}
          </>
            }
            </VStack>
            }


        </ModalBody>
        <ModalFooter>
          <VStack width="100%">
          <Button isDisabled={isDisabled || loading} width="100%" colorScheme="teal" onClick={handleGenerateLesson}>
            {loading ? <Spinner size="lg" /> : "Generate Lesson"}
          </Button>
          {loading && <Text fontSize="sm" my={0}>Sending your lesson...</Text> }
          {!loading && isDisabled && <Text fontSize="sm" my={0}>You can get a new lesson in {timeLeft} minutes.</Text>}
          </VStack>
        </ModalFooter>
    </ModalContent>
</Modal>
</>
  )


}
  
export default AdHocLessonButton;
