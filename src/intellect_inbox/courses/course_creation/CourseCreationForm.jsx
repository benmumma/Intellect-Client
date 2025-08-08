import React, { useState, useEffect } from 'react';
import { Box, Button, HStack, VStack, Text, Input, Image, Textarea, useToast, useColorModeValue, useMediaQuery, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SimpleGrid, Link, Divider} from '@chakra-ui/react';
import { useIntellectInbox } from '../../context/IntellectInboxContext.jsx';
import { useCourses } from '../../context/CoursesContext.jsx';
import { insert_ii_courses } from '../../api/ii_courses.js';
import { upsert_ii_user_courses } from '../../api/ii_user_courses.js';
import { API_BASE_URL } from '../../../constants/constants.js';

const useNewInstance = process.env.REACT_APP_USE_NEW_SUPABASE === 'true';

const CourseCreationForm = ({onClose, initialState}) => {
    const { inboxState, dispatch } = useIntellectInbox();
    const { state:courseState, dispatch:courseDispatch } = useCourses();
    const [step, setStep] = useState(1);
    const [courseSubject, setCourseSubject] = useState('');
    const [courseLength, setCourseLength] = useState(7);
    const [courseInstructor, setCourseInstructor] = useState('chat');
    const [customInstructor, setCustomInstructor] = useState('');
    const [courseLanguage, setCourseLanguage] = useState('English');
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const [courseLevel, setCourseLevel] = useState(9);
    const [courseWhy, setCourseWhy] = useState('');
    const [courseGoals, setCourseGoals] = useState('');
    const [courseAdded, setCourseAdded] = useState('');
    const [courseDetails, setCourseDetails] = useState('');
    const [validToProgress, setValidToProgress] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [isListed, setIsListed] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(true);
    const [showAdminDetails, setShowAdminDetails] = useState(false);
    const [showCourseAdjustments, setShowCourseAdjustments] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [tags, setTags] = useState([]);
    const toast = useToast();
    const inputBg = useColorModeValue("forwardWhite.100", "gray.700");
    const is_admin = inboxState.user_tier === 'admin';
    const [isMobile] = useMediaQuery("(max-width: 48em)");

    const breakdownCourseDetail = (courseDetails) => {
        const lines = courseDetails.split('\n');
        const result = {
            courseWhy: [],
            courseGoals: [],
            courseAdded: []
        };
    
        let currentField = null;
    
        lines.forEach(line => {
            line = line.trim();
            if (line.includes('I am taking the course because:') || line.includes('I\'m taking the course because:')) {
                currentField = 'courseWhy';
                result.courseWhy.push(line.split(':')[1].trim());
            } else if (line.includes('My goals are:') || line.includes('My Goals for the course are:')) {
                currentField = 'courseGoals';
                result.courseGoals.push(line.split(':')[1].trim());
            } else if (line.includes('Additional Details:')) {
                currentField = 'courseAdded';
                result.courseAdded.push(line.split(':')[1].trim());
            } else if (currentField && line) {
                result[currentField].push(line);
            }
        });
    
        // Join the arrays into strings and remove any empty properties
        Object.keys(result).forEach(key => {
            result[key] = result[key].join(' ').trim();
            if (result[key] === '') {
                delete result[key];
            }
        });
    
        return result;
    };
    

    useEffect(() => {
        setCourseSubject(initialState?.course_subject || '');
        setCourseLength(initialState?.course_length || 7);
        setCourseInstructor(initialState?.teacher_persona || 'chat');
        setCourseLevel(initialState?.course_level || 9);
        setCourseDetails(initialState?.course_details || '');
        setDisplayName(initialState?.display_name || '');
        setCourseDescription(initialState?.course_description || '');
        setTags(initialState?.tags || []);
        setCourseLanguage(initialState?.language || 'English');
        setCustomInstructor(initialState?.custom_instructor_details || '');

        const result = breakdownCourseDetail(initialState?.course_details || '');
        setCourseWhy(result?.courseWhy || '');
        setCourseGoals(result?.courseGoals || '');
        setCourseAdded(result?.courseAdded || '');


    }, [initialState])

    useEffect(() => {
        if (step === 1 && courseSubject.length > 0) {
            setValidToProgress(true);
        }}
    , [courseSubject, step]);

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePrevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const toggleLanguageOptions = () => {
        setShowLanguageOptions(!showLanguageOptions);
    };

    const handleSubmit = async () => {
        console.log('Course Created!');
        const level_to_send_chat = courseState.level_options.find((level) => level.level_id === courseLevel).name;
        const instructor_to_send_chat = courseState.instructor_options.find((instructor) => instructor.text_id === courseInstructor).description;
        setSubmitDisabled(true);
        let course_details_to_send = '';
        if(courseWhy.length > 0) {
            course_details_to_send += `I'm taking the course because: ${courseWhy}\n\n`;
        }
        if(courseGoals.length > 0) {
            course_details_to_send += `My Goals for the course are: ${courseGoals}\n\n`;
        }
        if(courseAdded.length > 0) {
            course_details_to_send += `Additional Details: ${courseAdded}`;
        }
        const data_to_send = {
            private_user_id: inboxState.user_id,
            course_subject: courseSubject,
            course_length: courseLength,
            course_level: courseLevel,
            teacher_persona: courseInstructor,
            course_details: course_details_to_send,
            language: courseLanguage,
            is_public: isPublic,
            is_listed: isListed,
            course_description: courseDescription,
        };
        if(courseInstructor === 'custom') {
            data_to_send.custom_instructor_details = customInstructor;
        }
        if(displayName.length > 0) {
            data_to_send.display_name = displayName;
        }
        if(tags.length > 0) {
            data_to_send.tags = tags;
        }
        console.log(data_to_send);
        
        try {
            // Send data to the database
            const { result: courseResult, message: courseMessage, data: courseData } = await insert_ii_courses(data_to_send);
            console.log(courseData);
            if (!courseState.can_create) {
                toast({
                    title: "Error",
                    description: "You have reached your course creation limit",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                onClose();
                throw new Error('You have reached your course creation limit');
            }
    
            if (courseResult === 'error') {
                throw new Error(courseMessage);
            }
    
            console.log('Course Created!');
            toast({
                title: "Course Created!",
                description: "Your course has been created, manage your schedule on the Active Courses table!",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            onClose();

            /*******************************************************/
            /*******************************************************/
            /* Create the curriculum */
            /*******************************************************/
            /*******************************************************/

            // Need to call backend to get a curriculum for the course
            const send_url = API_BASE_URL + 'intellectinbox/createCurriculum';
            const ai_data_to_send = {
                course_id: courseData.id,
                course_subject: courseSubject,
                course_length: courseLength,
                course_level: level_to_send_chat,
                teacher_persona: instructor_to_send_chat,
                course_details: course_details_to_send,
                language: courseLanguage,
                dbInstance: useNewInstance ? 'new' : 'current',
            };
            
            const ai_lesson_response = await fetch(send_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any required headers here
                },
                body: JSON.stringify(ai_data_to_send),
                // You might need to include credentials: 'include' if your backend requires authentication
            });
    
            if (ai_lesson_response.ok) {
                console.log('Curriculum Created!');
                toast({
                    title: "Curriculum Created!",
                    description: "Your course curriculum has been created, you can now begin your lessons!",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                throw new Error('Error creating curriculum');
            }
            /*******************************************************/
            /*******************************************************/
            /* Enroll in the course */
            /*******************************************************/
            /*******************************************************/

            if (!isEnrolled) {
                onClose();
                return;
            }
            else {

            // Need to insert a row into ii_user_courses
            const user_course_data = {
                user_id: inboxState.user_id,
                course_id: courseData.id,
                latest_lesson: 0,
                reception_time: 7,
                timezone: 'America/Chicago',
                status: 1,
                dow_schedule: {
                    "Fri": { "type": "standard" },
                    "Mon": { "type": "standard" },
                    "Sat": { "type": "off" },
                    "Sun": { "type": "off" },
                    "Thu": { "type": "off" },
                    "Tue": { "type": "off" },
                    "Wed": { "type": "standard" }
                }
            };
            console.log(user_course_data);
    
            // Send data to the database
            const { result: userCourseResult, message: userCourseMessage, data: userCourseData } = await upsert_ii_user_courses(user_course_data);
            if (userCourseResult === 'error') {
                throw new Error(userCourseMessage);
            }
            //Close the modal
            onClose();
            //ADD the course
            const newCourseData = {...courseData, ii_user_courses: [userCourseData]};
            courseDispatch({
                type: 'ADD_COURSE',
                payload: newCourseData
            });

    
            console.log('User Course Entry Added!');
        }
    
            
    
        } catch (error) {
            console.error('Error:', error.message);
            toast({
                title: "Error",
                description: `There was an error: ${error.message}`,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            //Reset the form
            setSubmitDisabled(false);
            setCourseSubject('');
            setCourseLength(7);
            setCourseInstructor('chat');
            setCourseLevel(3);
            setCourseDetails('');
            setCourseWhy('');
            setCourseGoals('');
            setDisplayName('');
            setTags([]);

        }
    };
    

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Box width="100%" as={VStack} alignItems="center" mb={4}>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>What do you want to learn about?</Text>
                        <Input
                            size="lg"
                            fontSize="xl"
                            textAlign="center"
                            fontWeight="bold"
                            boxShadow="lg"
                            placeholder={"Any subject..."}
                            variant="flushed"
                            bgColor={inputBg}
                            value={courseSubject}
                            onChange={(e) => setCourseSubject(e.target.value)}
                        />
                        <Button variant="ghost" colorScheme="teal" onClick={() => setShowCourseAdjustments(!showCourseAdjustments)}>
                            {showCourseAdjustments ? 'Hide Advanced' : 'Show Advanced'}
                        </Button>
                        {showCourseAdjustments && (
                            <>
                                <Text fontSize="md">Display Name</Text>
                                <Input
                                    size="lg"
                                    fontSize="xl"
                                    textAlign="center"
                                    fontWeight="bold"
                                    variant="flushed"
                                    bgColor={inputBg}
                                    boxShadow="lg"
                                    placeholder={"Display Name"}
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                                <Text fontSize="md">Description</Text>
                                <Textarea
                                    size="lg"
                                    fontSize="md"
                                    textAlign="center"
                                    variant="flushed"
                                    bgColor={inputBg}
                                    boxShadow="lg"
                                    placeholder={"Course Description"}
                                    value={courseDescription}
                                    onChange={(e) => setCourseDescription(e.target.value)}
                                />
                                <Text fontSize="md">Tags</Text>
                                <Input
                                    size="lg"
                                    fontSize="xl"
                                    textAlign="center"
                                    fontWeight="bold"
                                    variant="flushed"
                                    bgColor={inputBg}
                                    boxShadow="lg"
                                    placeholder={"Tag1, Tag2, Tag3"}
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value.split(",").map((tag) => tag.trim()))}
                                />
                            </>
                        )}
                    </Box>
                );
            case 2:
                return (
                    <Box width="100%" as={VStack} alignItems="center" mb={4}>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>How long should the course be?</Text>
                        <HStack width="100%" spacing={4} flexDir={isMobile ? 'column' : 'row'}>
                            <Button flex="1" size="lg" boxShadow="lg" fontSize="xl" colorScheme={courseLength === 5 ? 'teal':'gray'} onClick={() => setCourseLength(5)}>5 days</Button>
                            <Button flex="1" size="lg" boxShadow="lg" fontSize="xl" colorScheme={courseLength === 7 ? 'teal':'gray'} onClick={() => setCourseLength(7)}>7 days</Button>
                            <Button flex="1" size="lg" boxShadow="lg" fontSize="xl" colorScheme={courseLength === 14 ? 'teal':'gray'} onClick={() => setCourseLength(14)}>14 days</Button>
                            <Button flex="1" size="lg" boxShadow="lg" fontSize="xl" colorScheme={courseLength === 21 ? 'teal':'gray'} onClick={() => setCourseLength(21)}>21 days</Button>
                            {is_admin && <>
                                <Button flex="1" size="lg" boxShadow="lg" fontSize="xl" colorScheme={courseLength === 28 ? 'teal':'gray'} onClick={() => setCourseLength(28)}>28 days</Button>
                                <Button flex="1" size="lg" boxShadow="lg" fontSize="xl" colorScheme={courseLength === 35 ? 'teal':'gray'} onClick={() => setCourseLength(28)}>35 days</Button>
                            </>}
                        </HStack>
                        <Text color="gray" fontSize="sm" mt={2} fontStyle="oblique">Longer courses will cover the material in more detail, shorter courses will be more of an overview.</Text>
                    </Box>
                );
            case 3:
                return (
                    <Box width="100%" as={VStack} alignItems="center" mb={4}>
                        <Text fontSize="xl" fontWeight="bold" mb={4}>
                            At what level would you like the course to be taught?
                        </Text>
                        <Slider
                            defaultValue={courseLevel}
                            min={1}
                            max={courseState.level_options.length}
                            step={1}
                            onChange={(value) => setCourseLevel(value)}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Text fontSize="2xl" fontWeight="bold" mt={4}>
                            {courseState.level_options[courseLevel - 1].name}
                        </Text>
                        <Text color="gray" fontSize="sm" mt={2} fontStyle="oblique">
                            Students should choose 1-2 levels above their current grade, more if gifted. Adults should choose "College Freshmen" or higher.
                        </Text>
                    </Box>
                );
            case 4:
                    return (
                        <Box width="100%" as={VStack} alignItems="center" mb={4}>
                            <Text fontSize="xl" fontWeight="bold" mb={4}>
                                Who do you want to teach the course?
                            </Text>
                            <SimpleGrid  gap={2} 
                                        columns={3}
                                    width="100%"
                                    >
                                {courseState.instructor_options.map((instructor) => 
                                (
                                    <Button 
                                    key={instructor.text_id} 
                                    colorScheme={courseInstructor === instructor.text_id ? 'teal':'gray'} 
                                    minHeight={isMobile ? '110px' : '90px'}
                                    onClick={() => setCourseInstructor(instructor.text_id)}>
                                        {instructor.image_url === null && <Text>{instructor.name}</Text>}
                                        {instructor.image_url !== null && 
                                        <HStack width="100%" flexDir={isMobile ? 'column':'row'}>
                                        <Image boxSize="75px" src={instructor.image_url} alt={instructor.name} />
                                        <Text>{instructor.name}</Text>
                                        </HStack>}
                                    </Button>
                                ))}
                            </SimpleGrid>
                            <Text color="gray" fontSize="sm" mt={2} fontStyle="oblique">
                            {courseState.instructor_options.find((instructor) => instructor.text_id === courseInstructor).description}
                            </Text>
                            {courseInstructor === 'custom' && 
                            <>
                            <Text>I want the course taught by a(n)...</Text>
                            <Input mt={2} placeholder={"Describe an instructor!"} value={customInstructor} onChange={(e) => setCustomInstructor(e.target.value)} />
                            </>
                            }
                        </Box>
                    );
            case 5:
                return (
                    <Box>
                         <Text fontSize="xl" fontWeight="bold" mb={4}>
                                Optional: Additional Details
                        </Text>
                        <Text>Course language will be: <b>{courseLanguage}</b>&nbsp;&nbsp; <Link fontWeight="bold" color="teal" onClick={() => toggleLanguageOptions()}>Change?</Link></Text>
                        {showLanguageOptions && <><Text fontSize="lg" mb={4}>What language do you want the course to be taught in?</Text>
                        <Input placeholder={"English"} value={courseLanguage} onChange={(e) => setCourseLanguage(e.target.value)} mb={4} /></>}
                        <Text fontSize="lg" mb={4}>Why do you want to learn about <b>{courseSubject}</b>?</Text>
                        <Textarea placeholder={"Because..."} value={courseWhy} onChange={(e) => setCourseWhy(e.target.value)} />
                        <Text fontSize="lg" mb={4}>What are your goals for the course?</Text>
                        <Textarea placeholder={"I would like to..."} value={courseGoals} onChange={(e) => setCourseGoals(e.target.value)} />
                        <Text fontSize="lg" mb={4}>What else should we know to customize this for you?</Text>
                        <Textarea placeholder={"Anything else!"} value={courseAdded} onChange={(e) => setCourseAdded(e.target.value)} />
                        <Text color="gray" fontSize="sm" mt={2} fontStyle="oblique">
                            These details are optional, but help the AI create a course tailored to exactly what you want to learn!
                        </Text>
                        {is_admin &&
                        
                            <>
                            <Button variant="ghost" colorScheme="teal" onClick={() => setShowAdminDetails(!showAdminDetails)}>
                                {showAdminDetails ? 'Hide Admin Options' : 'Show Admin Options'}
                            </Button>
                        { showAdminDetails && <>
                        <HStack mt={4} justifyContent="space-between">
                        <Text fontSize="lg" mb={4}>Make Public?</Text>
                        <Button colorScheme={isPublic ? 'teal':'gray'} onClick={() => setIsPublic(!isPublic)}>{isPublic ? 'Public':'Private'}</Button>
                        </HStack>
                        <HStack mt={4} justifyContent="space-between">
                        <Text fontSize="lg" mb={4}>List in Directory?</Text>
                        <Button colorScheme={isListed ? 'teal':'gray'} onClick={() => setIsListed(!isListed)}>{isListed ? 'Listed':'Hidden'}</Button>
                        </HStack>
                        <HStack mt={4} justifyContent="space-between">
                        <Text fontSize="lg" mb={4}>Enroll in the course?</Text>
                        <Button colorScheme={isEnrolled ? 'teal':'gray'} onClick={() => setIsEnrolled(!isEnrolled)}>{isEnrolled ? 'Enrolled':'Just Create'}</Button>
                        </HStack> 
                        </>
                        }
                        </>
                        }
                        <Divider mt={4} />
                        
                    </Box>
                );

            case 6:
                return (
                    <Box padding="4" borderWidth="1px" borderRadius="lg" boxShadow="md">
    <Text fontSize="xl" fontWeight="bold" mb={6}>Review Your Course</Text>
    
    <Box mb={4} as={HStack} justifyContent="space-between">
        <Text fontWeight="semibold">Subject:</Text>
        <Text>{courseSubject}</Text>
    </Box>
    <Box mb={4} as={HStack} justifyContent="space-between">
        <Text fontWeight="semibold">Length:</Text>
        <Text>{courseLength} days</Text>
    </Box>
    <Box mb={4} as={HStack} justifyContent="space-between">
        <Text fontWeight="semibold">Level:</Text>
        <Text>{courseState.level_options.find((level) => level.level_id === courseLevel).name}</Text>
    </Box>
    <Box mb={4} as={HStack} justifyContent="space-between">
        <Text fontWeight="semibold">Instructor:</Text>
        <Text>{ courseInstructor === 'custom' ? customInstructor : courseState.instructor_options.find((instructor) => instructor.text_id === courseInstructor).name}</Text>
    </Box>
    <Box mb={4} as={HStack} justifyContent="space-between">
        <Text fontWeight="semibold">Language:</Text>
        <Text>{courseLanguage}</Text>
    </Box>

    <Box mb={4} as={VStack} justifyContent="space-between" alignItems="flex-start">
        <Text fontWeight="semibold">Why:</Text>
        <Text>{courseWhy}</Text>
    </Box>

    <Box mb={4} as={VStack} justifyContent="space-between" alignItems="flex-start">
        <Text fontWeight="semibold">Goals:</Text>
        <Text>{courseGoals}</Text>
    </Box>

    <Box mb={4} as={VStack} justifyContent="space-between" alignItems="flex-start">
        <Text fontWeight="semibold">Additional Details:</Text>
        <Text>{courseAdded}</Text>
    </Box>


    <Button 
        width="100%" 
        colorScheme="green" 
        isDisabled={submitDisabled || !courseState.can_create} 
        onClick={handleSubmit}
    >
        Create Course!
    </Button>
</Box>

                );
            default:
                return null;
        }
    };

    return (
        <Box p={4}>
            <VStack spacing={4} align="stretch">
                {renderStep()}
                <HStack justifyContent="space-between">
                <Button colorScheme="teal" onClick={handlePrevStep} isDisabled={step === 1} boxShadow="md">
                    Previous
                </Button>
                <Button colorScheme="teal" onClick={handleNextStep} isDisabled={step === 6 || !validToProgress} boxShadow="md">
                    Next
                </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default CourseCreationForm;