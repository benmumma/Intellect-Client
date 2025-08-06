import React from 'react';
import { VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Text, Heading } from "@chakra-ui/react";
import PremiumScheduler from '../forms/PremiumScheduler';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import limits from '../../../constants/limits';

const PremiumSchedulerModal = ({ isOpen, onClose }) => {
    const { inboxState } = useIntellectInbox();
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent>
                <VStack alignItems="flex-start" mx={2}>
                <ModalHeader>Advanced Scheduler</ModalHeader>
                    <Text mx={4}>Vary your lessons by day!</Text>
                    <Text mx={4}>Your account can receive Intellect Inbox up to {limits[inboxState.user_tier].weekly_lessons} days per week!</Text>
                </VStack>
                <ModalCloseButton />
                <ModalBody>
                    <PremiumScheduler onClose={onClose} />
                </ModalBody>
                <ModalFooter>
                   
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PremiumSchedulerModal;