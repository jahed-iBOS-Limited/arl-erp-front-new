import { createFile } from "../../../../_helper/excel/index";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";

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

const total = {
  quantity: 0,
  quantityInTon: 0,
  amount: 0,
};

const getTableData = (row) => {
  const arr = [];
  row.forEach((item) => {
    arr.push([
      new Cell(
        item?.customerName,
        true,
        "center",
        "text",
        "A1:J1",
        true
      ).getCell(),
    ]);
    item.objList.forEach((obj, objIndex) => {
      _formatMoney((total.quantity += obj?.deliveryQty));
      _formatMoney((total.quantityInTon += obj?.quantityInTon));
      _formatMoney((total.amount += obj?.deliveryValue), 2);
      arr.push([
        new Cell(objIndex + 1, false, "center", "text").getCell(),
        new Cell(
          _dateFormatter(obj?.deliveryDate),
          false,
          "left",
          "text"
        ).getCell(),
        new Cell(obj?.so, false, "left", "text").getCell(),
        new Cell(obj?.deliveryCode, false, "left", "text").getCell(),
        new Cell(obj?.itemName, false, "left", "text").getCell(),
        new Cell(obj?.shipPointName || "", false, "left", "text").getCell(),
        new Cell(obj?.uomName, false, "left", "text").getCell(),
        new Cell(obj?.deliveryQty, false, "right", "money").getCell(),
        new Cell(obj?.quantityInTon, false, "right", "money").getCell(),
        new Cell(obj?.itemRate, false, "right", "text").getCell(),
        new Cell(obj?.deliveryValue, false, "right", "text").getCell(),
      ]);
    });
    arr.push([
      new Cell("Total", true, "right", "text", "A1:G1", true).getCell(),
      new Cell(total.quantity, false, "right", "money", "", true).getCell(),
      new Cell(total.quantityInTon, false, "right", "money", "", true).getCell(),
      new Cell("", false, "right", "text", "", true).getCell(),
      new Cell(total.amount, false, "right", "money", "", true).getCell(),
    ]);
    total.quantity = 0;
    total.quantityInTon = 0;
    total.amount = 0;
  });

  return arr;
};

export const CreateCustomerStatementExcel = (
  values,
  row,
  buName,
  buAddress,
  documentName,
  reportName
) => {
  const excel = {
    name: documentName,
    sheets: [
      {
        name: documentName,
        gridLine: false,
        rows: [
          [
            {
              text: buName,
              fontSize: 16,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 12,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: reportName,
              fontSize: 12,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: `From Date: ${values?.fromDate}   To Date: ${values?.toDate}`,
              fontSize: 10,
              bold: true,
              cellRange: "A1:J1",
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
              text: "SO Number",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Challan No",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Product Name",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Shippoint",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "UoM",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Quantity",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Qnt (Ton)",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Rate",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Amount",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
          ],
          ...getTableData(row),
        ],
      },
    ],
  };
  createFile(excel);
};
