import moment from "moment";
import { _todayDate } from "./_todayDate";

export const YearDDL = (prevYear = 5, nextYear = 5) => {
  const prevFiveYears = +moment(_todayDate()).format("YYYY") - prevYear;
  const nextFiveYears = +moment(_todayDate()).format("YYYY") + nextYear;
  let yearDDLList = [];
  for (let i = prevFiveYears; i <= nextFiveYears; i++) {
    const element = i;
    yearDDLList.push({
      value: i,
      label: `${element}`,
    });
  }
  return yearDDLList;
};
