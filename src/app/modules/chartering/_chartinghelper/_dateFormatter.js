import isDate from "lodash/isDate";

export const _dateFormatter = (param) => {
  const date = new Date(param);
  if (isDate(date)) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return [year, month, day].join("-");
  }
  return "";
};
