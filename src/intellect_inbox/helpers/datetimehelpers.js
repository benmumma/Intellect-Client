
const format_hour = (hour) => {
    //Return the hour in 12 hour format from integer
    let htc = parseInt(hour)
    if (htc === 0) {
        return '12:00 AM';
    }
    else if (htc === 12) {
        return '12:00 PM';
    }
    else if (htc < 12) {
        return `${htc}:00 AM`;
    }
    else {
        return `${htc - 12}:00 PM`;
    }
    
}
export { format_hour  };