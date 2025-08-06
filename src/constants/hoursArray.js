import { format } from 'date-fns';

const hoursArray = Array.from({ length: 24 }, (_, index) => {
    const date = new Date();
    date.setHours(index);
    return {
        label: format(date, 'h:00 aa'),
        value: index
    };
});


export default hoursArray;