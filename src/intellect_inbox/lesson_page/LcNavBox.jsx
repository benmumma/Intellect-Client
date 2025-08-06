import React from "react";
import { Box, HStack, Text, useMediaQuery } from "@chakra-ui/react";
import useColors from "../theming/useColors";
import { useNavigate } from "react-router-dom";



const LcNavBox = ({lesson, index, isCurrent}) => {
    const colors = useColors();
    const navigate = useNavigate();
    const [isMobile] = useMediaQuery("(max-width: 48em)");

    const trimmed_post_name = lesson.post_name.length > 50 ? lesson.post_name.substring(0, 50) + '...' : lesson.post_name;

    return (
        <Box 
        p={1} 
        as={HStack} 
        flex="1" 
        bgColor={isCurrent ? colors.bg.teal_light : lesson.is_read ? colors.bg.green_light : colors.bg.darker} 
        fontWeight={isCurrent ? 'bold' : 'normal'}
        borderLeft={index > 0 ? '1px' : '0px'}
        textColor = {isCurrent ? colors.text.main : colors.text.main}
        _hover={{bgColor: colors.bg.teal, cursor: 'pointer', textColor: colors.text.inverse}}
        onClick={() => navigate(`/intellectinbox/lesson/${lesson.id}`)}
        >
                {!isMobile && <Text width="100%" textAlign="center" key={lesson.id} fontSize="xs" >
                    #{lesson.order_id}: {trimmed_post_name}
                </Text>}
                {isMobile && <Text width="100%" textAlign="center" key={lesson.id} fontSize="xs" >
                #{lesson.order_id}
                </Text>}
        </Box>
    )
}

export default LcNavBox;