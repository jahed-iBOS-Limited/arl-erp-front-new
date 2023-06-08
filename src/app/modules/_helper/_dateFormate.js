import isDate from "lodash/isDate";
import moment from "moment";

export const _dateFormatter = (param) => {
  if (param) {
    const date = new Date(param);
    if (isDate(date)) {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      return [year, month, day].join("-");
    }
    return "";
  } else {
    return "";
  }
};

export const _dateFormatterTwo = (param) => {
  if (param) {
    const date = new Date(param);
    if (isDate(date)) {
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      return [day, month, year].join("-");
    }
    return "";
  } else {
    return "";
  }
};

export const _dateTimeFormatter = (param, format) => {
  if (param) {
    const date = new Date(param);
    if (isDate(date)) {
      return moment(param).format(format ? format : "DD-MM-YYYY, hh:mm A");
    } else {
      return "";
    }
  } else {
    return "";
  }
};

export const dateFormatWithMonthName = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let dateArr = date.split("-");
  console.log(dateArr[1]);
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
