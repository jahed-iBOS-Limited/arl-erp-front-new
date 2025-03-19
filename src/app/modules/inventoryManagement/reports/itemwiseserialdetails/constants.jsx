import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";


function getDate10DaysBefore() {
  const today = new Date();
  const tenDaysBefore = new Date(today);
  tenDaysBefore.setDate(today.getDate() - 10);
  return tenDaysBefore;
}


export const initData={
  fromDate:_dateFormatter(getDate10DaysBefore()),
  toDate:_todayDate(),
  customer:"",
  item:"",
  usingStatus:{value:0,label:"All"},
  serialNumber:""
}

export const usedDDL=[
  {value:0,label:"All"},
  {value:1,label:"Used"},
  {value:2,label:"Unused"},
]