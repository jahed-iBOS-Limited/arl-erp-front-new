import React from "react";
import isDate from "lodash/isDate";

const IDate = (cellContent, row, rowIndex, { key }) => {
  const date = new Date(row[key]);
  const _isDate = isDate(date);
  var months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  let formatted_date = _isDate
    ? date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear()
    : null;

  return formatted_date ? <span>{formatted_date}</span> : <></>;
};
export default IDate;
