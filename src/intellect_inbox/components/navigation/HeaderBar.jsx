import React, {useState, useEffect} from 'react';
import { Box, Flex, Text, HStack, Image, VStack, Menu, MenuButton, MenuList, MenuItem, IconButton, Link, useDisclosure, useToast} from '@chakra-ui/react';
import { useIntellectInbox } from '../../context/IntellectInboxContext.jsx';
import { FaCog } from 'react-icons/fa';
import { AiFillClockCircle } from 'react-icons/ai';
import c from '../../../constants/uiConstants.js';
import PremiumSchedulerModal from '../modals/PremiumSchedulerModal.jsx';
import EditSettingsModal from '../modals/EditSettingsModal.jsx';
import AdHocLessonButton from '../buttons/AdHocLessonButton.jsx';
import { Link as RouterLink } from 'react-router-dom';
import { ii_supabase } from '../../../constants/supabaseClient.js';
import { format_hour } from '../../helpers/datetimehelpers.js';
import gh from '../../helpers/generic.js'

const HeaderBar = ({ values }) => {
    const toast = useToast();
    const { inboxState, dispatch } = useIntellectInbox();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isPremiumOpen, onOpen: onPremiumOpen, onClose: onPremiumClose } = useDisclosure();
    const [parameterList, setParameterList] = useState({});
    const isMobile = window.innerWidth < 768;
    //const isMobile = false;

    const handleChangeClick = ({ ...parameter_list }) => {
        console.log(parameter_list);
        setParameterList(parameter_list);
        onOpen();
    }

    const handleSignout = async () => {
        const { data, error:derror } = await ii_supabase.auth.refreshSession();
        if (derror) {
            console.error('Error refreshing session:', derror.message);
        } else {
            console.log('Session refreshed successfully', data);
        }
        const { error } = await ii_supabase.auth.signOut();
        if (!error) {
          toast({
            title: "Signed Out",
            description: "You have been signed out",
            status: "success",
            position: 'top',
            isClosable: true,
          });
          dispatch({ type: 'INBOX_SIGN_OUT' });
        }
        else {
          toast({
            title: "Error",
            description: "Error signing out",
            status: "error",
            position: 'top',
            isClosable: true,
          });
          console.error(error);
        }
      };

   const [currentSubject, setCurrentSubject] = useState('');
    const [currentAudience, setCurrentAudience] = useState('');

    useEffect(() => {
        if (inboxState.current_subject_object) {
            setCurrentSubject(inboxState.current_subject_object.subject_name);
        }
        if (inboxState.current_audience_object) {
            setCurrentAudience(inboxState.current_audience_object.audience_name);
        }
    }, [inboxState.current_subject_object, inboxState.current_audience_object]);
    

    return (
        <Flex justifyContent="space-between" alignItems="center" p={4} bg="teal.500" width="100%" position="sticky" zIndex="100" top="0">
            <HStack>
                <Image src="/home/ii-v1.png" width="50px" borderRadius="50px"/>
                <VStack alignItems="flex-start" spacing={0} overflowX={"hidden"}>
                    <HStack>
                    <Text fontSize={isMobile ? 'sm' : 'sm'} color="white">Hi {inboxState.user_name}</Text>
                    {inboxState.user_tier === 'admin' && <Link as={RouterLink} to="/intellectinbox/admin" fontSize={isMobile ? 'sm' : 'sm'} color="white">Admin</Link>}
                    </HStack>
                    <HStack>
                    <Text fontSize={isMobile ? 'sm' : 'lg'} fontWeight="bold" color="white" maxWidth={{'base':'100px','md':'300px'}} textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">{inboxState.email_address}</Text>
                {!isMobile && 
                <IconButton onClick={() => handleChangeClick({'email_address':true,'user_name':true})} 
                            aria-label="Edit" 
                            icon={c.icons.edit}
                            variant="ghost"
                            color="white" />
                }
                
                </HStack>
                {inboxState.user_tier === 'admin' && <Link as={RouterLink} to="/manage" color="white">{`Manage Account (${gh.capitalize(inboxState.user_tier)} Tier)`}</Link>}
                
                </VStack>
            </HStack>
            {!isMobile && <><Box>
                <VStack spacing={0} alignItems="flex-start"  overflowX={"hidden"}>
                <Text fontSize="sm" color="white">My Default Subject:</Text>
                <HStack><Text fontSize="lg" fontWeight="bold" color="white">{currentSubject} {currentAudience}</Text>
                <IconButton onClick={() => handleChangeClick({'current_subject':true,'current_audience':true})} 
                            aria-label="Edit" 
                            icon={c.icons.edit}
                            variant="ghost"
                            color="white" />
                </HStack>
                <HStack>
                <Link color="white" fontSize="sm" onClick={onPremiumOpen}>Vary Schedule by Day</Link>
                </HStack>
                </VStack>
            </Box>
            <Box>
                <VStack spacing={0} alignItems="flex-start"  overflowX={"hidden"}>
                <Text fontSize="sm" color="white">Daily E-mails at </Text>
                <HStack>
                <Text fontSize="lg" fontWeight="bold" color="white">{format_hour(inboxState.reception_time)} in {inboxState.timezone}</Text>
                <IconButton onClick={() => handleChangeClick({'reception_time':true,'timezone':true, 'reception_days':true})}
                aria-label="Edit" 
                icon={c.icons.edit}
                variant="ghost"
                color="white" />
                </HStack>
       
                </VStack>
            </Box></>}
            <HStack>
            {isMobile && 
                <IconButton onClick={() => handleChangeClick({'email_address':true,'user_name':true,'current_subject':true,'current_audience':true,'reception_time':true,'timezone':true,'reception_days':true})} 
                            aria-label="Edit" 
                            variant="outline"
                            color="white"
                            icon={c.icons.edit}
                            colorScheme="white" />
                }
                <AdHocLessonButton buttonText={isMobile ? '+ New' : 'New Lesson!'} />
                <Menu>
                    <MenuButton as={IconButton} aria-label="Options" icon={<FaCog />} variant="outline" textColor="white" colorScheme=""/>
                    <MenuList>
                        {(inboxState.user_tier === 'premium' || inboxState.user_tier === 'admin') && 
                        <>
                        {/*<MenuItem onClick={onPauseOpen}><HStack><AiFillPauseCircle /><Text>Pause/Unpause E-mails</Text></HStack></MenuItem>*/}
                        </>
                        }
                        <MenuItem onClick={onPremiumOpen}><HStack><AiFillClockCircle /><Text>Vary Schedule By Day</Text></HStack></MenuItem>
                        <MenuItem onClick={handleSignout}><HStack><Text>Sign Out</Text></HStack></MenuItem>

                    </MenuList>
                </Menu>
            </HStack>
            <EditSettingsModal parameter_list={parameterList} isOpen={isOpen} onClose={onClose} />
            <PremiumSchedulerModal isOpen={isPremiumOpen} onClose={onPremiumClose} />
        </Flex>
    );
};

export default HeaderBar;