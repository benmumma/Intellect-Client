import React, { useState } from 'react';
//import { Select } from '@chakra-ui/react';
import Select from 'react-select';
import { useColorModeValue } from '@chakra-ui/react';

const AudienceSelector = ({audiences, currentAudience, setCurrentAudience, mode="single_set", include_any=false, ...props}) => {

    const headerBg = useColorModeValue('var(--chakra-colors-forwardWhite-500)','var(--chakra-colors-teal-800)');
    const selectBg = useColorModeValue('var(--chakra-colors-forwardBlue-100)','var(--chakra-colors-teal-700)');
    const optionBg = useColorModeValue('var(--chakra-colors-forwardWhite-100)','var(--chakra-colors-teal-600)');
    const selectFont = useColorModeValue('black','white');
    const index = props.index;
    //console.log('Current Audience:', currentAudience)

    const minWidth = '270px';
    let current_audience;
    if(mode==="single_set") {
        if(currentAudience === null) {
            current_audience = {value:null, label:''}
        }
        else if (currentAudience === -1) {
            current_audience = {value:-1, label:'Any Audience'}
        }
        else {
    current_audience = { value: currentAudience, label: audiences?.find((audience) => audience.id === currentAudience)?.audience_name ?? '' } || {};
        }
    }
    else {
        if(currentAudience[index] === null) {
            current_audience = {value:null, label:''}
        }
        else if (currentAudience[index] === -1) {
            current_audience = {value:-1, label:'Any Audience'}
        }
        else {
        current_audience = { value: currentAudience[index], label: audiences.find((audience) => audience.id === currentAudience[index]).audience_name } || {};
        }
    }
    const [valueShown, setValueShown] = useState(current_audience);

    const main_aggregations = audiences
                                .filter((audience) => audience.status === 1)
                                .map((audience) => {
                                    return { value: audience.id, label: audience.audience_name };
                                });


    if(include_any) {
        main_aggregations.unshift({value:-1, label:'Any Audience'});
    }

    const options = [
        {label:'Main Audiences', options: main_aggregations},
    ];

    const handleChange = (e) => {
        console.log(e);
        if(mode==="single_set") {
        setCurrentAudience(e.value);
        setValueShown(e);
        }
        else {
            const newAudiences = [...currentAudience];
            newAudiences[props.index] = e.value;
            setCurrentAudience(newAudiences);
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


}

export default AudienceSelector;
