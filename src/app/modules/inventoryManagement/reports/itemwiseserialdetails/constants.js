import { _todayDate } from "../../../_helper/_todayDate";

export const initData={
  fromDate:_todayDate(),
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