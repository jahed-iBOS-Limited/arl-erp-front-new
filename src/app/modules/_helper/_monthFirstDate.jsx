import { _dateFormatter } from "./_dateFormate";

export const _monthFirstDate = () => {
  let date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);

  return _dateFormatter(firstDay);
};
