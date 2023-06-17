import { generateJsonToExcel } from "../../../_helper/excel/jsonToExcel";

export const generateSecondLevelList = ({
  list,
  matchField,
  secondLevelField,
}) => {
  if (!Array.isArray(list)) return [];
  const result = [];
  const unique = {};

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item?.[matchField]) break;
    if (!unique[item[matchField]]) {
      const secondLevelList = list?.filter(
        (x) => x[matchField] === item[matchField]
      );
      result.push({ ...item, [secondLevelField]: secondLevelList });
      unique[item[matchField]] = true;
    }
  }

  return result;
};

export const excelDownload = (excelData) => {
  let header = [
    {
      text: "Warehouse",
      textFormat: "text",
      alignment: "center:middle",
      key: "strWareHouseName",
    },
    {
      text: "Item Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "strItemName",
    },
    {
      text: "Item Code",
      textFormat: "text",
      alignment: "center:middle",
      key: "strItemCode",
    },
    {
      text: "Uom",
      textFormat: "text",
      alignment: "center:middle",
      key: "strBaseUOM",
    },
    {
      text: "Open Qty",
      textFormat: "text",
      alignment: "center:middle",
      key: "numOpenQty",
    },
    {
      text: "In Qty",
      textFormat: "text",
      alignment: "center:middle",
      key: "numInQty",
    },
    {
      text: "Closing Qty",
      textFormat: "text",
      alignment: "center:middle",
      key: "numCloseQty",
    },
    {
      text: "Out Qty",
      textFormat: "text",
      alignment: "center:middle",
      key: "numOutQty",
    },
    {
      text: "Rate",
      textFormat: "number",
      alignment: "center:middle",
      key: "numRate",
    },
  ];

  generateJsonToExcel(header, excelData, "Warehouse Wise Stock Report");
};
