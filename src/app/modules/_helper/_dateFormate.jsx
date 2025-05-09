import isDate from 'lodash/isDate';
import moment from 'moment';

// Format date // 2024-07-30T00:00:00 => 2024-07-30
export const _dateFormatter = (param) => {
  if (param) {
    const date = new Date(param);
    if (isDate(date)) {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      return [year, month, day].join('-');
    }
    return '';
  } else {
    return '';
  }
};

// Format date two // 2024-07-30T00:00:00 => 30-07-2024
export const _dateFormatterTwo = (param) => {
  if (param) {
    const date = new Date(param);
    if (isDate(date)) {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      return [day, month, year].join('-');
    }
    return '';
  } else {
    return '';
  }
};

export const _dateTimeFormatter = (param, format) => {
  if (param) {
    const date = new Date(param);
    if (isDate(date)) {
      return moment(param).format(format ? format : 'DD-MM-YYYY, hh:mm A');
    } else {
      return '';
    }
  } else {
    return '';
  }
};

// date.getDay() return 0-6 & 0 for sunday & upto 6 for saturday. access the current day index number from days array
export const _todayDayWeekName = () => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const date = new Date();
  const dayName = days[date.getDay()]; // days[4] // thursday
  return dayName; // Thursday
};

export const dateFormatWithMonthName = (date) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let dateArr = date.split('-');
  let year = dateArr[0];
  let month = monthNames[+dateArr[1] - 1];
  let day = dateArr[2];

  let modifiedDate = `${day} ${month} ${year}`;
  return modifiedDate;
};

export const addDaysToADate = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return _dateFormatter(result);
};

export const excelDateFormatter = (excelDate) => {
  // Excel date will be a number like 45426. You have to pass just that number.
  const date = new Date((excelDate - 25569) * 24 * 60 * 60 * 1000);
  return _dateFormatter(date);
};

// date.getMonth() reutrn 0-11 and 0 start for January & 11 for December. accessing the current index from months array we can get current month
export const currentMonthAndYear = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const date = new Date();
  const month = months[date.getMonth()]; // months[6] // July
  return `${month} ${date.getFullYear()}`; // July 24
};

export const formatDate = (dateString) => {
  // Parse the input date
  const date = moment(dateString, 'YYYY-MM-DD');

  // Get the day and determine the ordinal suffix
  const day = date.date();
  let dayWithSuffix;
  if (day % 10 === 1 && day !== 11) {
    dayWithSuffix = day + 'ST';
  } else if (day % 10 === 2 && day !== 12) {
    dayWithSuffix = day + 'ND';
  } else if (day % 10 === 3 && day !== 13) {
    dayWithSuffix = day + 'RD';
  } else {
    dayWithSuffix = day + 'TH';
  }

  // Get the month in uppercase
  const month = date.format('MMMM').toUpperCase();

  // Get the year
  const year = date.year();

  // Format the final string
  return `${dayWithSuffix} DAY OF ${month},${year}`;
};
