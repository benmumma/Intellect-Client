import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/constants';
import { Alert, AlertIcon } from '@chakra-ui/react';



const NewContactModal = ({
  isOpen,
  onClose,
}) => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userBody, setUserBody] = useState('');

    const handleNameChange = (event) => {
        const { value } = event.target;
        setUserName(value);
      };

      const handleEmailChange = (event) => {
        const { value } = event.target;
        setUserEmail(value);
      };

      const handleBodyChange = (event) => {
        const { value } = event.target;
        setUserBody(value);
      };

  

  const handleSubmit = async (event) => {
    console.log(API_BASE_URL);
    event.preventDefault();
    try {
        //userBody, userName, userEmail
      const response = await axios.post(API_BASE_URL+'mail/', {userBody:userBody,userName:userName,userEmail:userEmail});
      console.log(response);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
      onClose();
    }, 1337);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setUserName('');
    setUserEmail('');
    setUserBody('');
    }, [isOpen]);

  let who_to_contact = null;
  if (window.location.href.includes('intellectinbox')) {
    who_to_contact = 'Intellect Inbox';
  }
  else if (window.location.href.includes('forward')) {
    who_to_contact = 'Forward';
  }
  else {
    who_to_contact = 'Ben';
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} borderRadius="0px" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contact {who_to_contact}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl id="name" mb={4}>
              <FormLabel>Your Name</FormLabel>
              <Input variant="flushed" type="text" value={userName} onChange={handleNameChange} required />
            </FormControl>
            <FormControl id="email" mb={4}>
              <FormLabel>Your Email</FormLabel>
              <Input variant="flushed" type="email" value={userEmail} onChange={handleEmailChange} required  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"/>
            </FormControl>
            <FormControl id="message">
              <FormLabel>Your Message</FormLabel>
              <Textarea variant="flushed" value={userBody} onChange={handleBodyChange} required/>
            </FormControl>
            {showSuccessAlert && (
            <Alert status="success" mb={4}>
              <AlertIcon />
              Message sent successfully!
            </Alert>
          )}
          </ModalBody>
          <ModalFooter>
          {!showSuccessAlert && (<><Button colorScheme="blue" mr={3} type="submit" borderRadius="0px" >
              Send
            </Button>
            <Button variant="ghost" onClick={onClose} borderRadius="0px" >
              Cancel
            </Button></>
            )}
          </ModalFooter>
          </form>
        </ModalContent>
    </Modal>
  );
};

export default NewContactModal;