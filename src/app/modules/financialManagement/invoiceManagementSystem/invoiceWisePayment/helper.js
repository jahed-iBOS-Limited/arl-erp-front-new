import { generateJsonToExcel } from "../../../_helper/excel/jsonToExcel";

export const exportInvoiceWisePayment = (tableData) => {
  const header = [
    {
      text: "Customer Code",
      textFormat: "text",
      alignment: "center:middle",
      key: "strCutomerCode",
    },
    {
      text: "Customer Name",
      textFormat: "text",
      alignment: "left:middle",
      key: "strCustomerName",
    },
    {
      text: "Challan No",
      textFormat: "text",
      alignment: "center:middle",
      key: "strChallanNo",
    },
    {
      text: "Shipment Date",
      textFormat: "date",
      alignment: "center:middle",
      key: "dteShipmentDate",
    },
    {
      text: "Credit Days",
      textFormat: "number",
      alignment: "center:middle",
      key: "intCrDays",
    },
    {
      text: "Due date",
      textFormat: "date",
      alignment: "center:middle",
      key: "dteDueDate",
    },
    {
      text: "Overdue Days",
      textFormat: "number",
      alignment: "center:middle",
      key: "intOverdueDays",
    },
    {
      text: "Delivery Amount",
      textFormat: "number",
      alignment: "center:middle",
      key: "numDeliveryAmount",
    },
    {
      text: "Collected Amount",
      textFormat: "number",
      alignment: "center:middle",
      key: "numDeliveryAmountCollected",
    },
    {
      text: "Pending Amount",
      textFormat: "number",
      alignment: "center:middle",
      key: "numDeliveryAmountPending",
    },
    {
      text: "Vat Amount",
      textFormat: "number",
      alignment: "center:middle",
      key: "numVatAmount",
    },
    {
      text: "Collected Vat",
      textFormat: "number",
      alignment: "center:middle",
      key: "numVatAmountCollected",
    },
    {
      text: "Pending Vat",
      textFormat: "number",
      alignment: "center:middle",
      key: "numVatAmountPending",
    },
    {
      text: "AIT Amount",
      textFormat: "number",
      alignment: "center:middle",
      key: "numTaxAmount",
    },
    {
      text: "Collected AIT",
      textFormat: "number",
      alignment: "center:middle",
      key: "numTaxAmountCollected",
    },
    {
      text: "Pending AIT Amount",
      textFormat: "number",
      alignment: "center:middle",
      key: "numTaxAmountPending",
    },
  ];

  generateJsonToExcel(header, tableData, "Invoice Wise Payment");
};
