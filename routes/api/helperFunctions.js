/**
 * Returns the hours as a number from time string
 * @param {string} time in hh:mm
 * @returns {number} hour
 */
function parseHourFromTime(time) {
  let timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
  let arr = time.match(timeFormat);
  return parseInt(arr[1]);
}

/**
 * Returns the minutes as a number from time string
 * @param {string} time in hh:mm
 * @returns {number} minutes
 */
function parseMinuteFromTime(time) {
  let timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
  let arr = time.match(timeFormat);
  return parseInt(arr[2]);
}

/**
 * Adds minutes to date obj
 * @param {date} date 
 * @param {number} minutes 
 * @returns {date} 
 */
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

/**
 * Subtracts minutes from data obj
 * @param {date} date 
 * @param {number} minutes 
 * @returns {date}
 */
function subtractMinutes(date, minutes) {
  return new Date(date.getTime() - minutes*60000);
}

/**
 * Takes a number and adds a leading zero if neccessary for time format
 * @param {number} time in hours or minutes
 * @returns {string} formated time
 */
function formatTime(time) {
  if (time < 10) {
    return '0'+time; 
  } else {
    return ''+time;
  }
}

/**
 * Takes start date and adds duration for end date then formats date
 * @param {Date} date 
 * @param {number} duration 
 * @returns {string} formatted by "T00:00-T24:00"
 */
 function formatDate(date, duration) {
  const hour = formatTime(date.getHours());
  const minutes = formatTime(date.getMinutes());

  const endDate = addMinutes(date, parseInt(duration));
  const hour2 = formatTime(endDate.getHours());
  const min2 = formatTime(endDate.getMinutes());
  let startDateString = String('T'+hour+':'+minutes);
  let endDateString = String('T'+hour2+':'+min2);
  const finalFormat = startDateString+'-'+endDateString;
  // console.log(finalFormat);
  return finalFormat;
}

/**
 * Generates a random time slot for the activity
 * @param {string} startTime hh:mm
 * @param {string} endTime hh:mm
 * @param {string} duration time string in "T00:00-T24:00"
 */
 function randomTimeGenerator(startTime, endTime, duration) {

  // Convert starTime and endTime strings to date obj
  var startDate = new Date();
  var endDate =  new Date();

  startDate.setHours(parseHourFromTime(startTime));
  startDate.setMinutes(parseMinuteFromTime(startTime));
  endDate.setHours(parseHourFromTime(endTime));
  endDate.setMinutes(parseMinuteFromTime(endTime));

  // Calculates random timestamp within interval
  const spaces = (endDate.getTime() - startDate.getTime());
  let timestamp = Math.round(Math.random() * spaces);
  timestamp += startDate.getTime();
  const randomDate = new Date(timestamp);
  return formatDate(randomDate, duration);
}

/**
 * Converts a time string (e.g. '9:00') to total minutes
 * @param {string} time hh:mm
 * @returns {number} total mins
 */
 function timeToMinutes(time) {
  const timeFormat = /^([0-9]{2})\:([0-9]{2})$/;
  let arr = time.match(timeFormat);
  let hour = parseInt(arr[1]);
  let minutes = parseInt(arr[2]);
  let hourToMinutes = hour * 60;

  return hourToMinutes + minutes;
}

/**
 * Determines if duration fits within an interval
 * @param {string} startTime hh:mm
 * @param {string} endTime hh:mm
 * @param {string} duration number string
 * @returns {boolean}
 */
function withinInterval(startTime, endTime, duration) {
  // Total time in minutes returned
  let startTimeMins = timeToMinutes(startTime);
  let endTimeMins = timeToMinutes(endTime);

  let intervalLength = endTimeMins - startTimeMins;

  if (duration <= intervalLength) {
    // console.log("duration fits in interval");
    return true;
  }
  else {
    return false;
  }
}

/**
 * 
 * @param {*} schedule list of objects [{activity:'', duration:''}]
 */
function calculateSchedule(schedule) {
  let timeIntervals = [['09:00', '23:59']];
  const finalSchedule = [];
  // loop through list of activities
  for (let i = 0; i < schedule.length; i++) {
    // Parse for duration to work with
    const duration = parseInt(schedule[i].duration);

    // For each timeInterval, check if duration fits
    for (let j = 0; j < timeIntervals.length; j++) {
      let timeInterval = timeIntervals[j];
      let startTime = timeInterval[0];
      let endTime = timeInterval[1];
      const endTimeOrig = endTime;

      if (withinInterval(startTime, endTime, duration)) {
        // generate a random time block within that interval

        // Convert endTime string to date obj
        let endDate = new Date();
        let hour = parseHourFromTime(endTime);
        let minutes = parseMinuteFromTime(endTime);
        endDate.setHours(hour);
        endDate.setMinutes(minutes);
        
        // Subtract endDate with duration and return new date obj
        endDate = subtractMinutes(endDate, duration);

        // Format end time to string
        endTime = formatTime(endDate.getHours())+':'+formatTime(endDate.getMinutes());

        const timeSlot = randomTimeGenerator(startTime, endTime, duration);
        finalSchedule.push({
          activity: schedule[i].activity,
          duration: timeSlot
        })

        // timeSlot - 'T18:55-T19:25'
        const timeParse = timeSlot.split('-');
        const time1 = timeParse[0].split('T')[1]; // time1 = 18:55
        const time2 = timeParse[1].split('T')[1]; // time2 = 19:25
        
        // Set original end interval to start time of new time
        timeIntervals[j][1] = time1;

        // Push new interval to exclude newly generated duration for activity
        timeIntervals.push([time2, endTimeOrig ]);
        
        // console.log(timeIntervals);
        break;
      }
    }

  }
 return finalSchedule;
}

/**
 * 
 * @param {string} date start date from drag and drop
 * @param {string} date2 end date from drag and drop
 * @param {number} timeZoneDiff 
 * @returns {string} String format to save
 */
function convertToHHMM(date, date2) {

  // Apparently saves original timezone!
  let startDate = new Date(date);
  let endDate = new Date(date2);

  /*
  if (process.env.NODE_ENV == 'production') {
    startDate = subtractMinutes(startDate, timeZoneDiff);
    endDate = subtractMinutes(endDate, timeZoneDiff);
  }
  */

  const hour = formatTime(startDate.getHours());
  const minutes = formatTime(startDate.getMinutes());
  const hour2 = formatTime(endDate.getHours());
  const min2 = formatTime(endDate.getMinutes());
  let startDateString = String('T'+hour+':'+minutes);
  let endDateString = String('T'+hour2+':'+min2);
  const finalFormat = startDateString+'-'+endDateString;
  console.log(finalFormat);
  return finalFormat;
}

exports.calculateSchedule = calculateSchedule;
exports.convertToHHMM = convertToHHMM;