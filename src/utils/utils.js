


export function tConvert(time) {
   // Check correct time format and split into components
   time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
   let type = ''
   if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? type = 'AM' : type = 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
   }

   const charsToSubtract = time[0] < 10 ? 2 : 1
   return {
      time: `${time[0] < 10 ? '0' : ''}${time.join('').substring(0, time.length - charsToSubtract)}`,
      timeType: type
   }; // return adjusted time or original string
}

export const convertTime12to24 = (time12h) => {
   const [time, modifier] = time12h.split(' ');

   let [hours, minutes] = time.split(':');

   if (hours === '12') {
      hours = '00';
   }

   if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
   }

   return `${hours}:${minutes}`;
}

export const getCheckedString = (arr) => {
   let strArr = []
   arr.map(item => {
      if (item.checked) strArr.push(item.text)
   })
   return strArr
}

export const getFormattedDate = argDate => {
   const date = new Date(argDate)
   let year = date.getFullYear()
   let month = date.getMonth()
   let dateNum = date.getDate()
   month = month + 1
   if (month < 10) {
      month = `0${month}`
   }
   if (dateNum < 10) {
      dateNum = `0${dateNum}`
   }
   let dateFormatted = `${year}-${month}-${dateNum}`
   return dateFormatted
}

export function capitalize(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   // Directly return the joined string
   return splitStr.join(' ');
}
//  tConvert ('18:00:00');

export const getSessionTagName = name => {
   return name === 'topicsCovered' ? 'Topics Covered' :
      name === 'studentMode' ? 'Student Mood' :
         name === 'homeworkAssigned' ? 'Homework Assigned' :
            name === 'wasProductive' && 'Was the Session Productive'
}

export function getCurrentDate(separator = '-') {
   let newDate = new Date()
   let date = newDate.getDate();
   let month = newDate.getMonth() + 1;
   let year = newDate.getFullYear();

   return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
}

export const getLocalTimeZone = () => {
   const date = new Date();
   const dateAsString = date.toString();
   const timezone = dateAsString.match(/\(([^\)]+)\)$/)[1];
   let localTimeZone = []
   timezone.split(' ').map(item => localTimeZone.push(item.substring(0, 1)))
   let tz = localTimeZone.join('')
   if (tz === 'IST') return 'Asia/Kolkata'
   return tz
}

export const convertDateToTimezone = (t, tType, date, timeZone, originalTimeZone) => {
   const time = t;
   const timeType = tType;

   const startTime = convertTime12to24(
      `${time} ${timeType}`
   );

   const startHours = parseInt(startTime.split(":")[0]);
   const startMinutes = parseInt(startTime.split(":")[1]);

   let startDate = new Date(date);
   startHours !== NaN && startDate.setHours(startHours);
   startMinutes !== NaN && startDate.setMinutes(startMinutes);

   let updatedDate = new Date(new Date(
      startDate.toLocaleString('en-US', {
         timeZone,
      }),
   ))
   return updatedDate
}

export function formatAMPM(date) {
   var hours = date.getHours();
   var minutes = date.getMinutes();
   var ampm = hours >= 12 ? 'pm' : 'am';
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? '0' + minutes : minutes;
   var strTime = hours + ':' + minutes + ' ' + ampm;
   return strTime;
}

export const getStartDate = (startDate, userTimezoneOffset, timeZone) => {
   if (timeZone === 'US/Central') {
      return new Date(startDate.getTime() - userTimezoneOffset + 6 * 3600000);
   } else if (timeZone === 'US/Alaska') {
      return new Date(startDate.getTime() - userTimezoneOffset + 9 * 3600000);
   } else if (timeZone === 'US/Eastern') {
      return new Date(startDate.getTime() - userTimezoneOffset + 5 * 3600000);
   } else if (timeZone === 'US/Hawaii') {
      return new Date(startDate.getTime() - userTimezoneOffset + 10 * 3600000);
   } else if (timeZone === 'US/Mountain') {
      return new Date(startDate.getTime() - userTimezoneOffset + 7 * 3600000);
   } else if (timeZone === 'US/Pacific') {
      return new Date(startDate.getTime() - userTimezoneOffset + 8 * 3600000);
   } else {
      return new Date(startDate.getTime() - userTimezoneOffset - 5.5 * 3600000);
   }
}

export const getBackground = (totalLeangth, idx) => {
   let index = idx
   if (idx > totalLeangth - 1) {
      index = index % totalLeangth
   }
   const backgrounds = [
      '#51D294',
      '#C56DEE',
      '#6F7ADE',
      '#7DE94A',
      '#F6935A',
   ]
   return backgrounds[idx]
}
// // timezones
// function getCurrentLocalDateTime() {
//    return moment().format();
// }

// function convertLocalToUTC(dt, dtFormat) {
//    return moment(dt, dtFormat).utc().format()
// }