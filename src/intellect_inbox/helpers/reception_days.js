const format_dow_schedule = (reception_days, existing_schedule) => {
    /* I need the inputs from our settings form reception days (just a list of days) to end up formatted as follows:
    {"Mon":{"type":"standard"},"Tue":{"type":"standard"},"Wed":{"type":"standard"},"Thu":{"type":"standard"},"Fri":{"type":"standard"},"Sat":{"type":"standard"},"Sun":{"type":"standard"}}
    Where if the day is selected, the type is "standard" and if it is not selected, the type is "off" */
    //console.log(reception_days);
    //console.log(existing_schedule);
    if(!existing_schedule || Object.keys(existing_schedule).length === 0) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const schedule = {};
    days.forEach(day => {
        if (reception_days.includes(day)) {
            schedule[day] = {"type":"standard"};
        } else {
            schedule[day] = {"type":"off"};
        }
    });
    return schedule;
    }
    else {
        // We need to keep the existing_schedule and just update the type to off for days that are off.
        // Ensure all days exist on the schedule object first to avoid setting properties on undefined.
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const schedule = { ...existing_schedule };
        days.forEach(day => {
            if (!schedule[day]) {
                schedule[day] = { type: "off" };
            }
            if (!reception_days.includes(day)) {
                schedule[day].type = "off";
            } else {
                if (schedule[day]?.subject || schedule[day]?.audience) {
                    schedule[day].type = "premium";
                } else {
                    schedule[day].type = "standard";
                }
            }
        });
        //console.log(schedule);
        return schedule;
    }

}

const format_reception_days = (schedule) => {
    //console.log(schedule);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const reception_days = [];
    if (!schedule) {
        return null;
    }
    if (Object.keys(schedule).length === 0){
        return null;
    }
    
    days.forEach(day => {
        if (schedule[day] && schedule[day].type && schedule[day].type !== "off") {
            reception_days.push(day);
        }
    });
    //console.log(reception_days);
    return reception_days;

}

const make_reception_string = (dow_schedule) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let reception_string = "";
    if (!dow_schedule || typeof dow_schedule !== 'object') return '';
    days.forEach(day => {
        if (dow_schedule[day] && dow_schedule[day].type && dow_schedule[day].type !== "off") {
            reception_string += day + ", ";
        }
    });
    return reception_string.substring(0, reception_string.length - 2);
}

function isValidTimeZone(tz) {
    try {
        if (!tz || typeof tz !== 'string' || tz.trim() === '') return false;
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch (e) {
        return false;
    }
}

function getNextScheduledDay({dow_schedule, reception_time, timezone}) {
    // Guard against missing or invalid schedule
    if (!dow_schedule || typeof dow_schedule !== 'object') {
        return null;
    }

    // Helper function to get the next day
    const getNextDay = (day) => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const index = days.indexOf(day);
      return days[(index + 1) % 7];
    };

    // Get current date and time in a safe timezone (fallback to browser or UTC)
    const tz = isValidTimeZone(timezone)
        ? timezone.trim()
        : (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    const nowStr = new Date().toLocaleString('en-US', { timeZone: tz });
    const currentDate = new Date(nowStr);

    // Parse reception time
    //const [receptionHour, receptionMinute] = reception_time.split(':').map(Number);
    const receptionHour = reception_time;
    const receptionMinute = 0;

    // Set reception time for today
    const receptionDate = new Date(currentDate);
    receptionDate.setHours(receptionHour, receptionMinute, 0, 0);
    
    // Get current day abbreviation
    const currentDay = currentDate.toLocaleString('en-US', { weekday: 'short' });
    
    let checkDay = currentDay;
    let daysChecked = 0;
  
    while (daysChecked < 7) {
      // If current time is before reception time, check today
      // Otherwise, move to the next day
      if (daysChecked > 0 || currentDate >= receptionDate) {
        checkDay = getNextDay(checkDay);
      }
  
      // If the day exists in the schedule and is not "off", return it
      if (dow_schedule[checkDay] && dow_schedule[checkDay].type !== "off") {
        return { day: checkDay, ...dow_schedule[checkDay] };
      }
  
      daysChecked++;
    }
  
    // If no valid day found after checking all days, return null
    return null;
  }

export { format_dow_schedule, format_reception_days, make_reception_string, getNextScheduledDay };