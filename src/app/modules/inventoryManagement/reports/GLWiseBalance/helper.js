import { generateJsonToExcel } from "../../../_helper/excel/jsonToExcel";

export const generateExcel = (row) => {
  const header = [
    {
      text: "Business Unit",
      textFormat: "text",
      alignment: "center:middle",
      key: "strBusinessUnitName",
    },
    {
      text: "Warehouse",
      textFormat: "text",
      alignment: "center:middle",
      key: "strWarehouseName",
    },
    {
      text: "General Ledger",
      textFormat: "text",
      alignment: "center:middle",
      key: "strGeneralLedgerName",
    },
    {
      text: "Item",
      textFormat: "text",
      alignment: "center:middle",
      key: "strItemName",
    },
    {
      text: "Value",
      textFormat: "text",
      alignment: "center:middle",
      key: "totalValue",
    },
    {
      text: "Closing Qty",
      textFormat: "text",
      alignment: "center:middle",
      key: "numCloseQty",
    },
  ];

  generateJsonToExcel(header, row, "GL Wise Balance");
};
