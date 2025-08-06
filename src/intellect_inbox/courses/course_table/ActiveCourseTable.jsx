import React, { useMemo } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, useMediaQuery } from '@chakra-ui/react';
import NewCourseRow from '../course_row/NewCourseRow';
import AssortedLessonRow from '../course_row/AssortedLessonRow';

const ActiveCourseTable = ({ courses, view }) => {
    const [isMobile] = useMediaQuery("(max-width: 48em)");
    const [isMidScreen] = useMediaQuery("(max-width: 72em)");
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const { ii_user_courses, course_length } = course;
            if (!ii_user_courses.length) return false;

            const { status, latest_lesson } = ii_user_courses[0];
            const courseStatus = parseInt(status);
            const courseLength = parseInt(course_length);
            const courseLatestLesson = parseInt(latest_lesson);

            switch (view) {
                case 'active':
                    return courseStatus === 1 && courseLatestLesson < courseLength;
                case 'paused':
                    return courseStatus === 2;
                case 'archived':
                    return courseStatus === 3;
                case 'completed':
                    return courseStatus === 1 && courseLatestLesson >= courseLength;
                default:
                    return false;
            }
        });
    }, [courses, view]);

    let tableHeaders = ['Course', 'Details', 'Schedule', 'Progress', 'Actions'];
    let tableWidths = ['40%', '', '40%', '40%', ''];
    let minWidths = ['300px', '', '240px', '240px', ''];
    let maxWidths = ['400px', '', '', '', ''];
    if (isMobile) {
        tableHeaders = ['Course'];
    }
    else if (isMidScreen) {
        tableHeaders = ['Course', 'Details', 'Schedule', 'Actions'];
        tableWidths = ['30%', '', '', ''];
        minWidths = ['300px', '', '', ''];
        maxWidths = ['500px', '', '', ''];
    }


    return (
        <Box width="100%">
        <Table variant="simple">
            <Thead width="100%">
                <Tr width="100%">
                    {tableHeaders.map((header,index) => (
                        <Th key={header} width={tableWidths[index]} minWidth={minWidths[index]} maxWidth={maxWidths[index]}>{header}</Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {view === 'active' && <AssortedLessonRow />}
                {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
                        <NewCourseRow key={course.id} course={course} />
                    ))
                ) : (
                    <Tr>
                        <Td fontStyle="oblique" colSpan={tableHeaders.length}>No {view} courses found!</Td>
                    </Tr>
                )}
            </Tbody>
        </Table>
        </Box>
    );
};

export default ActiveCourseTable;