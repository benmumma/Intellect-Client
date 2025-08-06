import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, useMediaQuery, ModalBody, ModalFooter, ModalCloseButton, Tabs, Tab, TabPanel, TabPanels, TabList, useDisclosure } from '@chakra-ui/react';
import CourseCreationForm from './CourseCreationForm';
import CourseDirectory from './CourseDirectory';
import { useCourses } from '../../context/CoursesContext';
import EnrollLimit from '../course_limits/EnrollLimit';
import CreateLimit from '../course_limits/CreateLimit';

const CourseSelector = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { state: courseState } = useCourses();
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const [initialState, setInitialState] = useState({});
    const [tabIndex, setTabIndex] = useState(0);

    const handleOpenModal = () => {
        onOpen();
    };

    const handleCloseModal = () => {
        onClose();
        setInitialState({});
        setTabIndex(0);
    };

    const handleTabChange = (index) => {
        console.log('Changing tab to', index);
        setTabIndex(index);
    };

    const handleCourseModification = (course) => {
        console.log('Modifying course', course);
        setInitialState(course);
        setTabIndex(1);
    }

    return (
        <>
            <Button colorScheme="teal" onClick={handleOpenModal}>+ {isMobile ? '' : 'Course'}</Button>

            <Modal isOpen={isOpen} onClose={handleCloseModal} size="5xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Course Selector</ModalHeader>
                    <ModalCloseButton />
                    
                    <ModalBody>
                        <Tabs index={tabIndex} onChange={handleTabChange}>
                            <TabList width="100%">
                                <Tab width="100%" fontSize="lg">Available Courses</Tab>
                                <Tab width="100%" fontSize="lg">Build Custom Course</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <EnrollLimit />
                                    <CourseDirectory modFunction={handleCourseModification} />
                                </TabPanel>
                                <TabPanel>
                                    <CreateLimit />
                                    <CourseCreationForm onClose={handleCloseModal} initialState={initialState} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>

                    <ModalFooter>
                        
                    </ModalFooter>
                    
                </ModalContent>
            </Modal>
        </>
    );
};

export default CourseSelector;