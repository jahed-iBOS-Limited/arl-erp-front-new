import moment from "moment";

export const formatDate = (dateString) => {
  // Parse the input date
  const date = moment(dateString, "YYYY-MM-DD");

  // Get the day and determine the ordinal suffix
  const day = date.date();
  let dayWithSuffix;
  if (day % 10 === 1 && day !== 11) {
    dayWithSuffix = day + "ST";
  } else if (day % 10 === 2 && day !== 12) {
    dayWithSuffix = day + "ND";
  } else if (day % 10 === 3 && day !== 13) {
    dayWithSuffix = day + "RD";
  } else {
    dayWithSuffix = day + "TH";
  }

  // Get the month in uppercase
  const month = date.format("MMMM").toUpperCase();

  // Get the year
  const year = date.year();

  // Format the final string
  return `${dayWithSuffix} DAY OF ${month},${year}`;
};
