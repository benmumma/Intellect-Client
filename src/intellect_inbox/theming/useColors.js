import { useColorModeValue } from "@chakra-ui/react";

const useColors = () => {
  const colors = {
    bg: {
        main: useColorModeValue("forwardWhite.100", "gray.700"),
        contrast: useColorModeValue("forwardWhite.200", "gray.800"),
        darker: useColorModeValue("forwardWhite.300", "gray.900"),
        teal: useColorModeValue("teal.500", "teal.500"),
        teal_light: useColorModeValue("teal.300", "teal.300"),
        gray: useColorModeValue("gray.300", "gray.600"),
        green: useColorModeValue("green.500", "green.300"),
        green_light: useColorModeValue("green.300", "green.500"),
        yellow: useColorModeValue("yellow.500", "yellow.300"),
        yellow_light: useColorModeValue("yellow.300", "yellow.500"),
        red: useColorModeValue("red.500", "red.300"),
        },
    text: {
        main: useColorModeValue("gray.700", "gray.100"),
        inverse: useColorModeValue("gray.100","gray.700"),
        header: useColorModeValue("gray.800", "gray.200"),
        link: useColorModeValue("teal.500", "teal.300"),
        teal: useColorModeValue("teal.500", "teal.300"),
        teal_light: useColorModeValue("teal.300", "teal.500"),
        context: useColorModeValue("gray.500", "gray.400"),
        success: useColorModeValue("green.500", "green.300"),
        success_light: useColorModeValue("green.300", "green.500"),
        warning: useColorModeValue("yellow.500", "yellow.300"),
        warning_light: useColorModeValue("yellow.300", "yellow.500"),
        error: useColorModeValue("red.500", "red.300"),
        inactive: useColorModeValue("gray.400", "gray.600"),
        },
    button: {
        main: useColorModeValue("teal.500", "teal.300"),
        text: useColorModeValue("gray.800", "gray.200"),
        },
    border: {
        main: useColorModeValue("gray.400", "gray.600"),
        light: useColorModeValue("gray.300", "gray.700"),
        teal: useColorModeValue("teal.500", "teal.300"),
        black: useColorModeValue("black", "white"),
        },
    course_levels: {
        grade: useColorModeValue("blue.500", "blue.300"),
        middle: useColorModeValue("green.500", "green.300"),
        high: useColorModeValue("yellow.500", "yellow.300"),
        college: useColorModeValue("orange.500", "orange.300"),
        graduate: useColorModeValue("purple.500", "purple.300"),
        },

    
    }

    return colors;
};

export default useColors;
