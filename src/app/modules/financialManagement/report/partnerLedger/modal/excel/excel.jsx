import { createFile } from "./../../../../../_helper/excel/index";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../../_helper/_fixedPoint";
class Cell {
  constructor(label, isMerge, align, format, cellRange, bold) {
    this.text = label;
    this.isMerge = isMerge;
    this.alignment = `${align}:middle`;
    this.format = format;
    this.cellRange = cellRange;
    this.bold = bold;
  }
  getCell() {
    return this.isMerge
      ? {
          text: this.text,
          fontSize: 7,
          cellRange: this.cellRange,
          merge: true,
          border: "all 000000 thin",
          alignment: this.alignment || "",
          textFormat: this.format,
          bold: this.bold,
        }
      : {
          text: this.text,
          fontSize: 7,
          border: "all 000000 thin",
          alignment: this.alignment || "",
          textFormat: this.format,
          bold: this.bold,
        };
  }
}

const getTableData = (row) => {
  const arr = [];
  row.forEach((item, objIndex) => {
    arr.push([
      new Cell(objIndex + 1, false, "center", "text").getCell(),
      new Cell(
        _dateFormatter(item?.strBankJournalDate),
        false,
        "left",
        "text"
      ).getCell(),
      new Cell(item?.strGeneralLedgerCode, false, "left", "text").getCell(),
      new Cell(item?.strNarration, false, "left", "text").getCell(),
      new Cell(
        _fixedPoint(Math.abs(item?.numDebit)),
        false,
        "right",
        "money"
      ).getCell(),
      new Cell(
        _fixedPoint(Math.abs(item?.numCredit)),
        false,
        "right",
        "text"
      ).getCell(),
      new Cell(
        _fixedPoint(Math.abs(item?.numBalance)),
        false,
        "right",
        "text"
      ).getCell(),
    ]);
  });

  arr.push([
    new Cell("Total", true, "right", "text", "A1:D1", true).getCell(),
    new Cell(
      _fixedPoint(Math.abs(row?.reduce((a, b) => a + Number(b?.numDebit), 0))),
      false,
      "right",
      "money",
      "",
      true
    ).getCell(),
    new Cell(
      _fixedPoint(Math.abs(row?.reduce((a, b) => a + Number(b?.numCredit), 0))),
      false,
      "right",
      "money",
      "",
      true
    ).getCell(),
    new Cell(
      _fixedPoint(
        Math.abs(row?.reduce((a, b) => a + Number(b?.numDebit), 0)) -
          Math.abs(row?.reduce((a, b) => a + Number(b?.numCredit), 0))
      ),
      false,
      "right",
      "money",
      "",
      true
    ).getCell(),
  ]);

  return arr;
};
// Create Partner Ledger Excel
export const CreatePartnerLedgerExcel = ({
  selectedBusinessUnit,
  tableItem,
  values,
  rowDto,
}) => {
  const excel = {
    name: "Partner Ledger",
    sheets: [
      {
        name: "Partner Ledger",
        gridLine: false,
        rows: [
          [
            {
              text: selectedBusinessUnit?.label,
              fontSize: 16,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: selectedBusinessUnit?.address,
              fontSize: 12,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: "Partner Ledger",
              fontSize: 12,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: tableItem?.strPartnerName,
              fontSize: 12,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: `From Date: ${values?.fromDate}   To Date: ${values?.toDate}`,
              fontSize: 10,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          ["_blank*1"],
          [
            {
              text: "SL",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Date",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Code",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Description",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Debit",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Credit",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Balance",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
          ],
          ...getTableData(rowDto),
        ],
      },
    ],
  };
  createFile(excel);
};
