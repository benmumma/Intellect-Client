import React from 'react';
import { Button, HStack } from "@chakra-ui/react";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <HStack spacing={4}>
            {pageNumbers.map(number => (
                <Button 
                    key={number} 
                    onClick={() => paginate(number)} 
                    variant={currentPage === number ? "solid" : "outline"}
                >
                    {number}
                </Button>
            ))}
        </HStack>
    );
};

export default Pagination;
