import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";

export const insertDataInExcel = (data) => {
    const header = [
      {
        text: "SL",
        textFormat: "number",
        alignment: "center:middle",
        key: "sl",
      },
      {
        text: "Employee Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "employeeName",
      },
      {
        text: "Employee Id",
        textFormat: "number",
        alignment: "center:middle",
        key: "employeeId",
      },
      {
        text: "Workplace Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "workplaceName",
      },
      {
        text: "Designation",
        textFormat: "text",
        alignment: "center:middle",
        key: "empDesignation",
      },
      {
        text: "Start Date",
        textFormat: "text",
        alignment: "center:middle",
        key: "date",
      },
      {
        text: "Start Time",
        textFormat: "text",
        alignment: "center:middle",
        key: "startTime",
      },
      {
        text: "End Date",
        textFormat: "text",
        alignment: "center:middle",
        key: "endDate",
      },
      {
        text: "End Date",
        textFormat: "text",
        alignment: "center:middle",
        key: "endTime",
      },
      {
        text: "Bill Amount",
        textFormat: "text",
        alignment: "center:middle",
        key: "billAmount",
      },
      {
        text: "Approve Amount",
        textFormat: "text",
        alignment: "center:middle",
        key: "approveAmount",
      },
      {
        text: "Remarks",
        textFormat: "text",
        alignment: "center:middle",
        key: "remarks",
      },
      
    ];
    generateJsonToExcel(header, data?.data,"Pump Fooding Bill");
  };