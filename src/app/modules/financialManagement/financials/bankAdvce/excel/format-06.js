// import { merge } from "lodash"
import { _todayDate } from "../../../../_helper/_todayDate";
import { createFile } from "../../../../_helper/excel/index";

class Cell {
  constructor(label, align, format,cellRange) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format;
    this.cellRange=cellRange
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 7,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format,
      cellRange: this.cellRange || false,
      merge:this.cellRange ? true : false 
    };
  }
}

const getTableData = (row) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(String(index + 1), "center", "text",).getCell(),
      new Cell("Duty", "center", "text","B1:C1").getCell(),
      new Cell(item?.strNaration, "left", "text","D1:G1").getCell(),
      new Cell(item?.numAmount, "right", "money","H1:I1").getCell(),
    ];
  });
  return data;
};

export const formatSix = (
  values,
  row,
  selectedBusinessUnit,
  total,
  totalInWords,
  adviceBlobData,
  fileName
) => {
  const excel = {
    name: "Bank Advice",
    sheets: [
      {
        name: "Bank Advice",
        gridLine: false,
        rows: [
          // [
          //   {
          //     text: selectedBusinessUnit?.label,
          //     fontSize: 16,
          //     bold: true,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "center:middle",
          //   },
          // ],
          // [
          //   {
          //     text:
          //       "Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.",
          //     fontSize: 12,
          //     bold: true,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "center:middle",
          //   },
          // ],
          // ["_blank*2"],
          // [
          //   {
          //     text: "Date : "+_todayDate(),
          //     fontSize: 9,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: "The Manager",
          //     fontSize: 9,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: values?.bankAccountNo?.bankName,
          //     fontSize: 9,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: values?.bankAccountNo?.address,
          //     fontSize: 9,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text:
          //       "Subject: Request to Debit our account by settling as per instructions.",
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // ["_blank*2"],
          // [
          //   {
          //     text: "Dear Sir,",
          //     fontSize: 9,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: `You are requested to Debit our Account: ${values?.bankAccountNo?.bankAccNo} by settling as per instructions below:`,
          //     fontSize: 8,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          [
            {
              text: "SL",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Request For",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
              cellRange: "B1:C1",
              merge: true,
              alignment: "center:middle",
            },
            {
              text: "Description",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
              cellRange: "D1:G1",
              merge: true,
              alignment: "center:middle",
            },
            {
              text: "Debiting Amount",
              fontSize: 7,
              bold: true,
              border: "all 000000 thin",
              cellRange: "H1:I1",
              merge: true,
            },
          ],
          ...getTableData(row),
          // [
          //   {
          //     text: "Total",
          //     fontSize: 7,
          //     bold: true,
          //     border: "all 000000 thin",
          //     cellRange: "A1:G1",
          //     merge: true,
          //     alignment: "center:middle",
          //   },
          //   {
          //     text: total,
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //     bold: true,
          //     cellRange: "H1:I1",
          //     merge: true,
          //     alignment: "right:middle",
          //     textFormat: "money",
          //   },
          // ],
          // ["_blank*1"],
          // [
          //   {
          //     text: `In Word : ${totalInWords} Taka Only.`,
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // ["_blank*1"],
          // [
          //   {
          //     text: `N:B: If documents contain any discrepancy, we are ready to accept the same.`,
          //     fontSize: 9,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // ["_blank*1"],
          // [
          //   {
          //     text: `Yours Faithfully`,
          //     fontSize: 9,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: "For "+selectedBusinessUnit?.label,
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:I1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // ["_blank*2"],
          // [
          //   {
          //     text: `Authorize Signature`,
          //     fontSize: 10,
          //     bold: true,
          //     cellRange: "A1:C1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          //   {
          //     text: `Authorize Signature`,
          //     fontSize: 10,
          //     bold: true,
          //     cellRange: "D1:F1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
        ],
      },
    ],
  };

  createFile(excel, adviceBlobData, fileName);
};
