import React, { useState, useEffect } from 'react';
//import { Select } from '@chakra-ui/react';
import Select from 'react-select';
import { useColorModeValue } from '@chakra-ui/react';
import { useIntellectInbox } from '../../context/IntellectInboxContext';

const SubjectSelector = ({subjects, currentSubject, setCurrentSubject, mode="single_set", include_any=false, ...props}) => {
    const {inboxState, dispatch} = useIntellectInbox();
    const headerBg = useColorModeValue('var(--chakra-colors-forwardWhite-500)','var(--chakra-colors-teal-800)');
    const selectBg = useColorModeValue('var(--chakra-colors-forwardBlue-100)','var(--chakra-colors-teal-700)');
    const optionBg = useColorModeValue('var(--chakra-colors-forwardWhite-100)','var(--chakra-colors-teal-600)');
    const selectFont = useColorModeValue('black','white');
    const index = props.index;  
    //console.log('Current Subject:', currentSubject)
    //console.log(subjects);

    const minWidth = '270px';
    let current_subject;
    if(mode==="single_set") {
        if(currentSubject === null) {
            current_subject = {value:null, label:''}
        }
        else {
        current_subject = { value: currentSubject, label: subjects.find((subject) => subject.id === currentSubject)?.subject_name } || {id:null, subject_name:''};
        }
    }
    else {
        if(currentSubject[index] === null) {
            current_subject = {value:null, label:''}
        }
        else {
        current_subject = { value: currentSubject[index], label: subjects.find((subject) => subject.id === currentSubject[index])?.subject_name } || {};
        }
    }
    const getCurrentSubject = () => {
        if (mode === "single_set") {
            if (currentSubject === null) {
                return { value: null, label: '' };
            } 
            else if (currentSubject === -1) {
                return { value: -1, label: 'Any Subject' };
            }
            else {
                const foundSubject = subjects.find(subject => subject.id === currentSubject);
                return foundSubject ? { value: foundSubject.id, label: foundSubject.subject_name } : { value: null, label: '' };
            }
        } else {
            if (currentSubject[index] === null) {
                return { value: null, label: '' };
            } 
            else if (currentSubject[index] === -1) {
                return { value: -1, label: 'Any Subject' };
            }
            else {
                const foundSubject = subjects.find(subject => subject.id === currentSubject[index]);
                return foundSubject ? { value: foundSubject.id, label: foundSubject.subject_name } : { value: null, label: '' };
            }
        }
    };

    const [valueShown, setValueShown] = useState(getCurrentSubject());

    //useEffect(() => {
    //    setValueShown(getCurrentSubject());
    //}, [currentSubject, index]);

    const main_aggregations = subjects
                                .filter((subject) => subject.status === 1)
                                .filter((subject) => subject.is_available)
                                .filter((subject) => subject.is_aggregation)
                                .filter((subject) => subject.private_user_id === null)
                                .map((subject) => {
                                    return { value: subject.id, label: subject.subject_name };
                                });

    const other_options = subjects
                            .filter((subject) => subject.status === 1)
                            .filter((subject) => subject.is_available)
                            .filter((subject) => !subject.is_aggregation)
                            .filter((subject) => subject.private_user_id === null)
                            .map((subject) => {
                                return { value: subject.id, label: subject.subject_name };
                            });
                            
    const testing_options = subjects
                            .filter((subject) => subject.status === 1)
                            .filter((subject) => !subject.is_aggregation)
                            .filter((subject) => !subject.is_available)
                            .filter((subject) => subject.private_user_id === null)
                            .map((subject) => {
                                return { value: subject.id, label: subject.subject_name };
                            });

    const custom_options = subjects
                            .filter((subject) => subject.status === 1)
                            .filter((subject) => subject.private_user_id === inboxState.user_id)
                            .map((subject) => {
                                return { value: subject.id, label: subject.subject_name };
                            });

    if (include_any) {
        main_aggregations.unshift({ value: -1, label: 'Any Subject' });
    }


    const options = [
        {label:'Curated Aggregations', options: main_aggregations},
        {label:'Other Subjects', options: other_options},
        {label:'Focused Subjects', options: testing_options},
        {label:'My Custom Subjects', options: custom_options}
    ];

    const handleChange = (e) => {
        console.log(e);
        if(mode==="single_set") {
        setCurrentSubject(e.value);
        setValueShown(e);
        }
        else {
            const newSubjects = [...currentSubject];
            newSubjects[props.index] = e.value;
            setCurrentSubject(newSubjects);
            setValueShown(e);
        }
    }

    let selectStyles = {
        container: (provided) => ({
            ...provided,
            width: '100%',
        }),
        control: (provided) => ({
          ...provided,
          borderRadius: '0px', // Set your desired border radius
          border:'0px',
          fontWeight:'bold',
          minWidth: minWidth, // Set your desired minimum width
          backgroundColor: optionBg,
          width:'100% !important',
          flex:1,
        }),
        groupHeading: (provided) => ({
          ...provided,
          backgroundColor: headerBg, // Set your desired background color for headers
          fontWeight: 'bold',
        }),
        option: (provided, { data, isDisabled, isFocused, isSelected}) => ({
            ...provided,
            backgroundColor: isSelected ? selectBg : optionBg,
            color: isSelected ? selectFont : provided.color,
            ':active':{
                fontWeight:'bold',
            },
            ':hover':{
                fontWeight:'bold',
                backgroundColor: selectBg,
            },
        }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: optionBg,
        }),
        singleValue: (provided) => ({
            ...provided,
            color: selectFont,
        }),
        // You can add more style customizations here
      }

    return (
        <Select value={valueShown}
                        onChange={handleChange}
                        styles={selectStyles}
                        defaultValue={"34"}
                        borderRadius={0}
                        options={options}
                        {...props}
                        />
    );
};

export default SubjectSelector;