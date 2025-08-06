
import React from 'react';
import { Box, VStack, Center, Heading, Button, Divider, Text, Image, UnorderedList, ListItem, Link } from '@chakra-ui/react';
import useColors from '../theming/useColors';

const HomePageText = () => {
    const colors = useColors();
    const boxBg = colors.bg.main;
    return (
        <VStack width="100%" maxWidth="700px" spacing={12} mb={12}>
                    <VStack
                      p={8}
                      width="100%"
                      backgroundColor={boxBg}
                      borderRadius={4}
                      boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                    >
                      <Heading as="h2" size="md" textAlign={'center'}>What is Intellect Inbox?</Heading>
                      <Divider my={4} borderColor="teal" width="50%" />
                      <UnorderedList px={2} spacing={2}>
                        <ListItem>We help you learn anything! We do this with structured courses personalized to you.</ListItem>
                        <ListItem>Tailor all your lessons to your background, knowledge, interests, and schedule.</ListItem>
                        <ListItem>Lessons built with GPT-4o and Claude 3.5</ListItem>
                      </UnorderedList>
                    </VStack>
  
                    <VStack
                      p={8}
                      width="100%"
                      backgroundColor={boxBg}
                      borderRadius={4}
                      boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                    >
                      <Heading as="h2" size="md" textAlign={'center'}>How Much Does it Cost?</Heading>
                      <Divider my={4} borderColor="teal" width="50%" />
                      <UnorderedList px={2} spacing={2}>
                        <ListItem fontWeight="bold">Our daily lessons and public course catalog are free, and always will be!</ListItem>
                        <ListItem>You can build 1 personalized course for free. After that - you can either purchase credits for $4.99 per course, or subscribe to our premium plan for $6.99/mo!</ListItem>
                      </UnorderedList>
                    </VStack>
  
                    <VStack
                      p={8}
                      backgroundColor={boxBg}
                      width="100%"
                      borderRadius={4}
                      boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                    >
                      <Heading as="h2" size="md" textAlign={'center'}>How is it personalized?</Heading>
                      <Divider my={4} borderColor="teal" width="50%" />
                      <UnorderedList px={2} spacing={2}>
                        <ListItem>Choose from <b>over 120 subjects</b> to learn about!</ListItem>
                        <ListItem>Choose <b>which days</b> of the week and <b>what time</b> you want to receive your lessons, weekly, daily, or somewhere in-between.</ListItem>
                        <ListItem>Have the lessons <b>written based on who is learning</b>:</ListItem>
                        <UnorderedList px={2} spacing={0}>
                          <ListItem>Parents of 5-8 year-olds</ListItem>
                          <ListItem>Parents of 9-12 year-olds</ListItem>
                          <ListItem>Parents of 13-17 year-olds</ListItem>
                          <ListItem>Students</ListItem>
                          <ListItem>Adult Learners</ListItem>
                          <ListItem>Subject Experts</ListItem>
                        </UnorderedList>
                        <ListItem>Our courses can be entirely personalized: choose the subject, goals, context, language, instructor persona, and more!</ListItem>
                      </UnorderedList>
                    </VStack>
  
                    <VStack
                      p={8}
                      backgroundColor={boxBg}
                      width="100%"
                      borderRadius={4}
                      boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                    >
                      <Heading as="h2" size="md" textAlign={'center'}>How does Intellect Inbox help parents?</Heading>
                      <Divider my={4} borderColor="teal" width="50%" />
                      <UnorderedList px={2} spacing={2}>
                        <ListItem>Built to help you help you and your family learn in a fast, easy, and fun way!</ListItem>
                        <ListItem>We give you an explanation of the subject, then provide a detailed script for how to introduce the topic to your child in an engaging way.</ListItem>
                        <ListItem>Then, we provide an easy setup activity that can engage your child for hours!</ListItem>
                      </UnorderedList>
                    </VStack>
  
                    <VStack
                      p={8}
                      backgroundColor={boxBg}
                      width="100%"
                      borderRadius={4}
                      boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;"
                    >
                      <Heading as="h2" size="md" textAlign={'center'}>Human Intelligence + Artificial Intelligence = Accelerated Learning</Heading>
                      <Divider my={4} borderColor="teal" width="50%" />
                      <UnorderedList px={2} spacing={2}>
                        <ListItem>AI generates our lessons & we are constantly iterating and improving them!</ListItem>
                        <ListItem>AI helps us personalize the lessons to your background, interests, and knowledge level.</ListItem>
                        <ListItem>Our goal is simple: make it as easy as possible to use AI to learn new things!</ListItem>
                      </UnorderedList>
                    </VStack>
                    
                  </VStack>
    )

}

export default HomePageText;