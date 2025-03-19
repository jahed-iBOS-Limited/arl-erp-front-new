// return next month 01 date from current date

import { _todayDate } from "./_todayDate";

export const nextMonth = () => {
  let today = _todayDate();

  let arr = today.split("-");
  let year = arr[0];
  let month = arr[1];

  let newYear = month === "12" ? +year + 1 : year;
  let newMonth = month === "12" ? "01" : +month + 1;
  let newDay = "01";

  let nextChangeDate = `${newYear}-${newMonth}-${newDay}`;
  return nextChangeDate;
};
