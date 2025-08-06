import React from 'react';
import {
    Box,
    Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    useToast,
} from '@chakra-ui/react';

import { useIntellectInbox } from '../../context/IntellectInboxContext';
import EditSettingsForm from '../forms/EditSettingsForm';
const EditSettingsModal = ({ parameter_list, isOpen, onClose }) => {

    const { inboxState, dispatch } = useIntellectInbox();

    

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <EditSettingsForm parameter_list={parameter_list} onClose={onClose} />
                </ModalBody>

                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditSettingsModal;