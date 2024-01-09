import { generateJsonToExcel } from "../../../_helper/excel/jsonToExcel";

export const insertDataInExcel = (data) => {
    const header = [
      {
        text: "SL",
        textFormat: "number",
        alignment: "center:middle",
        key: "sl",
      },
      {
        text: "Plant",
        textFormat: "text",
        alignment: "center:middle",
        key: "plantName",
      },
      {
        text: "Ware House",
        textFormat: "text",
        alignment: "center:middle",
        key: "wareHouseName",
      },
      {
        text: "Item Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "itemName",
      },
      {
        text: "Item Code",
        textFormat: "number",
        alignment: "center:middle",
        key: "itemCode",
      },
      {
        text: "Item Code",
        textFormat: "number",
        alignment: "center:middle",
        key: "itemCode",
      },
      {
        text: "UOM Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "baseUom",
      },
      {
        text: "Inventory Location",
        textFormat: "text",
        alignment: "center:middle",
        key: "inventoryLocationName",
      },
      {
        text: "Bin Number",
        textFormat: "number",
        alignment: "center:middle",
        key: "binNumber",
      },
      {
        text: "Min Stock Qty",
        textFormat: "number",
        alignment: "center:middle",
        key: "nMinimumStockQuantity",
      },
      {
        text: "Safety Stock Qty",
        textFormat: "number",
        alignment: "center:middle",
        key: "safetyStockQuantity",
      },
      {
        text: "Max Stock Qty",
        textFormat: "number",
        alignment: "center:middle",
        key: "maximumQuantity",
      },
      {
        text: "Reorder Level",
        textFormat: "number",
        alignment: "center:middle",
        key: "reorderLevel",
      },
      {
        text: "Reorder Qty",
        textFormat: "number",
        alignment: "center:middle",
        key: "reorderQuantity",
      },
      {
        text: "Avg Daily Consumption",
        textFormat: "number",
        alignment: "center:middle",
        key: "averageDailyConsumption",
      },
      {
        text: "Max Lead Days",
        textFormat: "number",
        alignment: "center:middle",
        key: "maxLeadDays",
      },
      {
        text: "Min Lead Days",
        textFormat: "number",
        alignment: "center:middle",
        key: "minLeadDays",
      },
      {
        text: "ABC",
        textFormat: "text",
        alignment: "center:middle",
        key: "abc",
      },
      {
        text: "FNS",
        textFormat: "text",
        alignment: "center:middle",
        key: "fns",
      },
      {
        text: "VED",
        textFormat: "text",
        alignment: "center:middle",
        key: "ved",
      },
    ];
    generateJsonToExcel(header, data?.data);
  };