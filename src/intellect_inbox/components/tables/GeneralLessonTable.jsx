import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Input,
  Box,
  Link,
  Button,
  useMediaQuery,
  HStack,
  Heading,
  Select,
  VStack,
  Text,
  Tooltip,
  Icon,
  Divider
} from '@chakra-ui/react';
import { FaCaretDown, FaCaretUp, FaDiscourse } from 'react-icons/fa';
import { useTable, useSortBy, useGlobalFilter, useFilters } from 'react-table';
import ReadButton from '../interactions/ReadButton';
import NotesComponent from '../interactions/NotesComponent';
import { useIntellectInbox } from '../../context/IntellectInboxContext';
import { useCourses } from '../../context/CoursesContext';
import format from 'date-fns/format';
import RatingButton from '../buttons/RatingButton';
import { Link as ReachLink } from 'react-router-dom';
import useColors from '../../theming/useColors';
import { ii_supabase } from '../../../constants/supabaseClient';

const GeneralLessonTable = React.memo(({ lessons, course_id = null }) => {
    useEffect(() => {
      console.log('GeneralLessonTable received new lessons:', lessons);
  }, [lessons]);
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const { inboxState, dispatch } = useIntellectInbox();
  const { state: courseState } = useCourses();
  const colors = useColors();
  let my_course = {};
  if (course_id > 0) {
    my_course = courseState.courses.find(course => course.id === course_id);
  }

  const updateRating = async (post_id, rating) => {
    dispatch({
      type: 'UPDATE_RATING',
      payload: { post_id, rating }
    });

    const { error } = await ii_supabase.from('ii_user_posts').upsert({
      post_id,
      user_id: inboxState.user_id,
      rating
    });

    if (error) {
      console.error('Error updating rating:', error);
    }
  };

  // Custom filter input component
  const ColumnFilter = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
      <Input
        value={filterValue || ''}
        onChange={e => setFilter(e.target.value)}
        placeholder={`Filter ${column.Header}`}
        size="sm"
      />
    );
  };

  const BooleanFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
    const counts = React.useMemo(() => {
      const counts = { true: 0, false: 0 };
      preFilteredRows.forEach(row => {
        counts[String(row.values[id])] += 1;
      });
      return counts;
    }, [id, preFilteredRows]);

    return (
      <Select
        value={filterValue}
        size="sm"
        borderRadius={0}
        borderColor={colors.border.main}
        fontSize="xs"
        onChange={e => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All ({preFilteredRows.length})</option>
        <option value="true">Read ({counts.true})</option>
        <option value="false">Unread ({counts.false})</option>
      </Select>
    );
  };

  const RatingFilter = ({ column: { filterValue, setFilter } }) => {
    return (
      <Input
        value={filterValue || ''}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter Rating"
        size="sm"
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: course_id > 0 ? 'order_id' : 'id',
        Filter: ColumnFilter,
      },
      {
        Header: 'Title',
        accessor: row => {
          const courseText = row.course_id === null
            ? `${row.subject_name} ${row.audience_name}`
            : `${my_course.display_name} ${row.order_id} of ${my_course.course_length}`;
          return `${row.post_name} ${courseText}`;
        },
        Cell: ({ value, row }) => (
          <HStack>
            <Button size="sm" colorScheme="teal" as={ReachLink} to={"/intellectinbox/lesson/" + row.original.id}>View</Button>
            <VStack align="flex-start" spacing={0}>
              <Heading as={Link} size="sm" href={`/intellectinbox/lesson/${row.original.id}`} color={colors.text.header}>
                {row.original.post_name}
              </Heading>
              {row.original.course_id === null && <Text textColor={colors.text.context}>{row.original.subject_name} {row.original.audience_name}</Text>}
              {row.original.course_id !== null && <Text textColor={colors.text.context}>{my_course.display_name} {row.original.order_id} of {my_course.course_length}</Text>}
            </VStack>
          </HStack>
        ),
        Filter: ColumnFilter,
      },
      {
        Header: 'Date',
        accessor: 'created_at',
        Cell: ({ value }) => format(new Date(value), 'MMM dd @ h:mm a'),
        Filter: ColumnFilter,
      },
      {
        Header: 'Complete',
        accessor: 'is_read',
        Cell: ({ row }) => (
          <ReadButton
            user_id={inboxState.user_id}
            post_id={row.original.id}
            is_read={row.original.is_read}
          />
        ),
        Filter: BooleanFilter,
        filter: (rows, id, filterValue) => {
          if (filterValue === '' || filterValue === undefined) return rows;
          const booleanFilterValue = filterValue === 'true';
          return rows.filter(row => row.values[id] === booleanFilterValue);
        },
        sortType: (rowA, rowB, columnId) => {
          const a = rowA.values[columnId] ? 1 : 0;
          const b = rowB.values[columnId] ? 1 : 0;
          return a - b;
        },
      },
      {
        Header: 'Rating',
        accessor: 'rating',
        Cell: ({ row }) => <RatingButton postId={row.original.id} currentRating={row.original.rating} updateRating={updateRating} />,
        Filter: RatingFilter,
        filter: (rows, id, filterValue) => {
          if (!filterValue) return rows;
          const match = filterValue.match(/^([<>]=?|=)?\s*(\d+)$/);
          if (!match) return rows;
          const [, operator = '=', value] = match; // Default to '=' if operator is not provided
          const numericValue = parseFloat(value);
          return rows.filter(row => {
            const rowValue = parseFloat(row.values[id]);
            if (operator === '>') return rowValue > numericValue;
            if (operator === '>=') return rowValue >= numericValue;
            if (operator === '<') return rowValue < numericValue;
            if (operator === '<=') return rowValue <= numericValue;
            return rowValue === numericValue;
          });
        }
      },
      {
        Header: 'Notes',
        accessor: 'notes',
        Cell: ({ row }) => (
          <HStack>
            <NotesComponent user_id={inboxState.user_id} post_id={row.original.id} notes={row.original.notes} />
            {row.original.thread_id === null ? <></> : <Tooltip label="Has AI Discussion"><Box><Icon as={FaDiscourse} color="green" /></Box></Tooltip>}
          </HStack>
        ),
        Filter: ColumnFilter,
      },
    ],
    []
  );

  let initialState = {
    sortBy: [
      {
        id: 'created_at',
        desc: true, // Sort by date in descending order
      },
    ],
  }

  if (lessons.length > 20) {
    initialState.filters = [
      {
        id: 'is_read',
        value: 'false', // Filter to only show incomplete lessons
      },
    ]
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
    setFilter
  } = useTable(
    {
      columns,
      data: lessons,
      defaultColumn: { Filter: ColumnFilter },
      initialState: initialState,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  useEffect(() => {
    if (isMobile) {
      setFilter('is_read', undefined);
    }
  }, [isMobile, setFilter]);

  return (
    <Box>
      <Input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search lessons..."
        variant="flushed"
        mb={4}
      />
      {isMobile && (
  <Box mb={4}>
    <BooleanFilter column={{
      filterValue: state.filters.find(filter => filter.id === 'is_read')?.value || '',
      setFilter: (value) => setFilter('is_read', value),
      preFilteredRows: rows,
      id: 'is_read',
    }} />
  </Box>
)}

      {isMobile ? (
        <VStack spacing={4} width="100%">
          {rows.map(row => {
            prepareRow(row);
            const { post_name, subject_name, audience_name, created_at, is_read, rating, notes } = row.original;
            return (
              <Box key={row.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
                <HStack>
                <Button size="sm" colorScheme="teal" as={ReachLink} to={"/intellectinbox/lesson/" + row.original.id}>View</Button>
              <Heading as={Link} size="sm" href={`/intellectinbox/lesson/${row.original.id}`} color={colors.text.header}>
                {post_name}
              </Heading>
              </HStack>
              <Divider my={1} />
              <HStack justifyContent="space-between" width="100%">
              {row.original.course_id === null && <Text textColor={colors.text.context}>{row.original.subject_name} {row.original.audience_name}</Text>}
              {row.original.course_id !== null && <Text textColor={colors.text.context}>{my_course.display_name} {row.original.order_id} of {my_course.course_length}</Text>}
                <Text>{format(new Date(created_at), 'MMM dd @ h:mm a')}</Text>
              </HStack>
              <Divider my={1} />
                <HStack mt={4} spacing={4}>
                  <ReadButton user_id={inboxState.user_id} post_id={row.original.id} is_read={is_read} />
                  <RatingButton postId={row.original.id} currentRating={rating} updateRating={updateRating} />
                  <NotesComponent user_id={inboxState.user_id} post_id={row.original.id} notes={notes} />
                </HStack>
              </Box>
            );
          })}
        </VStack>
      ) : (
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                <Tr {...headerGroup.getHeaderGroupProps()} >
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      isNumeric={column.isNumeric}
                      borderBottom="1px" borderColor={colors.border.main}
                    >
                      {column.render('Header')}
                      <chakra.span pl="4">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaCaretDown aria-label="sorted descending" />
                          ) : (
                            <FaCaretUp aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                  ))}
                </Tr>
                <Tr>
                  {headerGroup.headers.map((column) => (
                    <Th key={column.id} borderBottom="1px" borderColor={colors.border.main}>
                      {column.canFilter ? column.render('Filter') : null}
                    </Th>
                  ))}
                </Tr>
              </React.Fragment>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric} borderBottom="1px" borderColor={colors.border.main}>
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </Box>
  );
});

export default GeneralLessonTable;
