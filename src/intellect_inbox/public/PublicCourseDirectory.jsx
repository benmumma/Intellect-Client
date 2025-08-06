import React, {useEffect, useState} from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, VStack, Text, useMediaQuery, Input, HStack} from '@chakra-ui/react';
import MyHeader from '../../general/components/MyHeader';
import Footer from '../../general/components/Footer';
import { ii_supabase } from '../../constants/supabaseClient';
import useColors from '../theming/useColors';
import DirectoryRow from '../courses/directory_row/DirectoryRow';
import PublicDirectoryRow from './PublicDirectoryRow';

const PublicCourseDirectory = ({maxHeight = null}) => {


    const [publicCourses, setPublicCourses] = useState([]);
    const colors = useColors();
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = publicCourses.filter(course => {
        const textString = course.display_name + course.course_description + course.language + course.course_subject + course.tags + course.teacher_persona;
        return (textString.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    );
    
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const { data, error } = await ii_supabase
                    .from('ii_courses')
                    .select(`*,
                        ii_instructors (name, description, image_url, status),
                        ii_levels (level_id, name)
                        `)
                    .eq('status', 1)
                    .eq('is_listed', true)


                if (error) {
                    throw new Error(error.message);
                }
                console.log(data);

                setPublicCourses(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCourseData();
    }, []);

    return (
        <Box maxHeight={maxHeight} overflowY={maxHeight === null ? "auto" : "scroll"} overflowX="clip" width="100%">
            <Input
                placeholder="Search courses"
                value={searchQuery}
                variant="filled"
                size="lg"
                boxShadow="md"
                onChange={(e) => setSearchQuery(e.target.value)}
                mb={4}
                width="100%"
            />
            <HStack>
                {/* Filters to go here */}
            </HStack>
            <Table variant="simple" width="100%">
                    <Thead>
                        <Tr>
                            {!isMobile && (
                                <>
                                    <Th>Course Name</Th>
                                    <Th>Instructor</Th>
                                    <Th>
                                        <VStack alignItems="flex-start">
                                            <Text>Length</Text>
                                            <Text>Level</Text>
                                        </VStack>
                                    </Th>
                                </>
                            )}
                            {isMobile && <Th>Course</Th>}
                        </Tr>
                    </Thead>
                    <Tbody>
                    {publicCourses && filteredCourses.map((course) => {
                        return (<PublicDirectoryRow key={course.id} course={course} mode="public" />)
                    })
        }
                    </Tbody>
                </Table>
                </Box>
    );
};

export default PublicCourseDirectory;