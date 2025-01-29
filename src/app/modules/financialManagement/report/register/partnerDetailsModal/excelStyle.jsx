import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";


export const contractualExcelColumn = {
  sl: "SL",
  strBankJournalDate: "Date",
  strGeneralLedgerCode: "Code",
  strGeneralLedgerName: "Account Name",
  strNarration: "Description",
  numDebit: "Debit",
  numCredit: "Credit",
  numBalance: "Balance",
};

export const contractualExcelData = (tableRow) => {
  let newArr = [];
  newArr = tableRow.map((itm, index) => {
    return {
      sl: index + 1,
      strBankJournalDate: _dateFormatter(itm?.strBankJournalDate),
      strGeneralLedgerCode: itm?.strGeneralLedgerCode || " ",
      strGeneralLedgerName: itm?.strGeneralLedgerName || " ",
      strNarration: itm?.strNarration || " ",
      numDebit: _formatMoney(itm?.numDebit || 0),
      numCredit: _formatMoney(itm?.numCredit * -1 || 0),
      numBalance: _formatMoney(itm?.numBalance || 0),
    };
  });
  return newArr;
};

const contractualExcelWorkSheet = (
  cellArr,
  textCellArr,
  worksheet,
  rowIndex
) => {
  textCellArr.forEach((cell) => {
    worksheet.getCell(`${cell}${6 + rowIndex}`).alignment = {
      horizontal: "left",
      wrapText: true,
    };
  });
  cellArr.forEach((cell) => {
    worksheet.getCell(`${cell}${6 + rowIndex}`).alignment = {
      horizontal: "left",
      wrapText: true,
    };
  });
};

// column alignment
export const alignmentExcelFunc = (
  cellArr,
  textCellArr,
  filterIndex,
  worksheet,
  rowIndex
) => {
  switch (filterIndex) {
    default:
      return contractualExcelWorkSheet(
        cellArr,
        textCellArr,
        worksheet,
        rowIndex
      );
  }
};
