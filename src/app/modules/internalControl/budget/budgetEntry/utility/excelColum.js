import { getRowTotal } from "../helper";

// all salary report
export const budgetEntryCostExcelColumn = {
  sl: "SL",
  costRevCenterName: "Cost Revenue Center Name",
  strElementCode: "Code",
  strElementName: "Description",
  numBudgetQty: "Plan/Target Qty.",
  numBudgetValue: "Plan/Target Amount",
};
export const budgetEntryExcelColumn = {
  sl: "SL",
  strElementCode: "Code",
  strElementName: "Description",
  numBudgetQty: "Plan/Target Qty.",
  numBudgetValue: "Plan/Target Amount",
};

export const budgetExcelData = (arr) => {
  let newArr = [];
  newArr = arr.map((itm, index) => {
    return {
      sl: index + 1,
      strElementCode: itm?.strElementCode || " ",
      strElementName: itm?.strElementName || " ",
      numBudgetQty: itm?.numBudgetQty || " ",
      numBudgetValue: itm?.numBudgetValue || " ",
    };
  });

  return newArr;
};

export const budgetExcelCostData = (arr) => {
  let newArr = [];
  newArr = arr.map((itm, index) => {
    return {
      sl: index + 1,
      costRevCenterName: itm?.costRevCenterName || " ",
      strElementCode: itm?.strElementCode || " ",
      strElementName: itm?.strElementName || " ",
      numBudgetQty: itm?.numBudgetQty || " ",
      numBudgetValue: itm?.numBudgetValue || " ",
    };
  });

  return newArr;
};

const allSalaryExcelWorkSheet = (worksheet, rowIndex) => {
  worksheet.getCell(`D${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`E${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
};
const allSalaryCostExcelWorkSheet = (worksheet, rowIndex) => {
  worksheet.getCell(`E${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`F${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
};

const allSalaryExcelWorkSheetTotal = (worksheet, excelTableData, rowDto) => {
  let total = worksheet.addRow([
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "numBudgetQty"),
    getRowTotal(rowDto, "numBudgetValue"),
  ]);
  total.eachCell((cell) => {
    cell.alignment = { horizontal: "left" };
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });
  worksheet.getCell(`C${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`D${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`E${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };

  return worksheet;
};
const allSalaryExcelWorkSheetCostTotal = (
  worksheet,
  excelTableData,
  rowDto
) => {
  let total = worksheet.addRow([
    " ",
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "numBudgetQty"),
    getRowTotal(rowDto, "numBudgetValue"),
  ]);
  total.eachCell((cell) => {
    cell.alignment = { horizontal: "left" };
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });
  worksheet.getCell(`D${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`E${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`F${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };

  return worksheet;
};

// column alignment
export const alignmentExcelFunc = (filterIndex, worksheet, rowIndex) => {
  switch (filterIndex) {
    case 2:
    case 3:
      return allSalaryCostExcelWorkSheet(worksheet, rowIndex);
    default:
      return allSalaryExcelWorkSheet(worksheet, rowIndex);
  }
};

// total row
export const totalRowWorkSheet = (
  worksheet,
  excelTableData,
  rowDto,
  filterIndex
) => {
  switch (filterIndex) {
    case 2:
    case 3:
      return allSalaryExcelWorkSheetCostTotal(
        worksheet,
        excelTableData,
        rowDto
      );
    default:
      return allSalaryExcelWorkSheetTotal(worksheet, excelTableData, rowDto);
  }
};
