import { _dateFormatter } from "../../../../_helper/_dateFormate";

export const dateToDigit = (d) => {
  let date = _dateFormatter(d);
  const stringDate = date.split("-").reverse();
  let mon = stringDate[1];
  let day = stringDate[0];
  let year = stringDate[2];
  return `${day?.charAt(0)}${day?.charAt(1)}${mon?.charAt(0)}${mon?.charAt(
    1
  )}${year?.charAt(0)}${year?.charAt(1)}${year?.charAt(2)}${year?.charAt(3)}`;
};
