import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";

export const generateExcel = (data) => {
  const header = [
    {
      text: "SL",
      textFormat: "number",
      alignment: "center:middle",
      key: "sl",
    },
    {
      text: "Unit Code",
      textFormat: "text",
      alignment: "center:middle",
      key: "businessUnitCode",
    },
    {
      text: "PO No",
      textFormat: "text",
      alignment: "center:middle",
      key: "poNumber",
    },
    {
      text: "LC No",
      textFormat: "date",
      alignment: "center:middle",
      key: "lcNumber",
    },
    {
      text: "LC Type",
      textFormat: "text",
      alignment: "center:middle",
      key: "lcType",
    },
    {
      text: "Bank",
      textFormat: "date",
      alignment: "center:middle",
      key: "bank",
    },
    {
      text: "Currency",
      textFormat: "text",
      alignment: "center:middle",
      key: "currency",
    },
    {
      text: "Invoice Amount (BDT)",
      textFormat: "text",
      alignment: "center:middle",
      key: "bdtAmount",
    },
    {
      text: "Invoice Amount (FC)",
      textFormat: "text",
      alignment: "center:middle",
      key: "shipmentAmount",
    },
    {
      text: "Shipment NO",
      textFormat: "number",
      alignment: "center:middle",
      key: "shipmentNo",
    },
    {
      text: "Due Date",
      textFormat: "number",
      alignment: "center:middle",
      key: "dueDate",
    },
    {
      text: "Transaction Date",
      textFormat: "money",
      alignment: "center:middle",
      key: "dteTransactionDate",
    },
  ];

  const _data = data.map((item, index) => {
    return {
      ...item,
      dueDate: _dateFormatter(item?.dueDate),
      dteTransactionDate: _dateFormatter(item?.dteTransactionDate),
    };
  });

  generateJsonToExcel(header, _data, "Outstanding Payment - Unit Wise");
};
