import React from 'react';
import { Box, Flex, Tooltip, Icon, HStack } from '@chakra-ui/react';
import { FaGraduationCap } from 'react-icons/fa';
import useColors from '../../theming/useColors';

const levelMapping = [
  { label: 'Grade School', levels: 5, color:'grade' },    // 1-5
  { label: 'Middle School', levels: 3, color:'middle' },   // 6-8
  { label: 'High School', levels: 4, color:'high' },     // 9-12
  { label: 'College', levels: 4, color:'college' },         // 13-16
  { label: 'Grad School +', levels: 3, color:'graduate' }    // 17-19
];

const getShadingForLevel = (level, sectionIndex) => {
  let cumulativeLevels = 0;
  for (let i = 0; i <= sectionIndex; i++) {
    cumulativeLevels += levelMapping[i].levels;
  }
  const sectionStartLevel = cumulativeLevels - levelMapping[sectionIndex].levels + 1;
  const sectionEndLevel = cumulativeLevels;

  if (level >= sectionStartLevel && level <= sectionEndLevel) {
    const relativeLevel = level - sectionStartLevel + 1;
    return 1;
  }
  else if (level > sectionStartLevel) {
    return 0.75;
  }
  return 0;
};



const CourseLevelVisualizer = ({ level }) => {
  const colors = useColors();
  
  const getLevelColor = (level) => {
    //console.log('Level:', level);
    let level_color = 'gray.200'
    let level_name = 'Unknown';
    let l_counter = 0;
    //console.log('Starting Comparison:')
    for (const levelRow in levelMapping) {
      //console.log('LCounter:',l_counter);
      if (level > l_counter) {
        level_color = colors.course_levels[levelMapping[levelRow].color];
        level_name = levelMapping[levelRow].label;
      }
      l_counter = l_counter + levelMapping[levelRow].levels;
      //console.log('New LCounter:',l_counter);

    }
    return {level_color, level_name};
  }
  const {level_color, level_name} = getLevelColor(level);
  return (
    <HStack spacing={2}>
      <Icon as={FaGraduationCap} boxSize={6} marginRight="8px" color="gray.500" />
      <Tooltip label={level_name} aria-label={level_name}>
      <Flex>
        {levelMapping.map((section, index) => {
          const shading = getShadingForLevel(level, index);
          return (
              <Box
                key={index}
                width="20px"
                height="10px"
                margin="2px"
                backgroundColor={shading > 0 ? level_color : 'gray.200'}
                opacity={shading > 0 ? shading : 1}
                borderRadius="6px"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.1)', cursor: 'pointer' }}
              />
          );
        })}
      </Flex>
      </Tooltip>
    </HStack>
  );
};

export default CourseLevelVisualizer;
