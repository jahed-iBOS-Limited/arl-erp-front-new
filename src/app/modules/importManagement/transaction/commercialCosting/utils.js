import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";
import { _firstDateofMonth } from './../../../_helper/_firstDateOfCurrentMonth';

export const setDataToGridData = (key, index, value, grid, setter, label) => {
  let data = [...grid];
  data[index][key] = value;
  setter([...data]);
};

export const initData = {
  costTypeDDL: "",
  fromDate: _dateFormatter(_firstDateofMonth()),
  toDate: _todayDate(),
  dueDate: "",
};

export function removeDaysToDate(date, days) {
  let res = new Date(date);
  res.setDate(res.getDate() - days);
  return res;
}

export const inputHandler = (name, value, sl, rowDto, setRowDto) => {
  let data = [...rowDto];
  let _sl = data[sl];
  _sl[name] = value;
  setRowDto(data);
};

export const quantityCheck = (quantity) => {
  if (quantity < 0) {
    return false;
  } else if (quantity >= 0) {
    return true;
  }
};
