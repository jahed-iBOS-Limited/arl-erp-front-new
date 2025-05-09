// import { merge } from "lodash"
import { createFile } from '../../../../_helper/excel/index';

class Cell {
  constructor(label, align, format) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format;
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 7,
      border: 'all 000000 thin',
      alignment: this.alignment || '',
      textFormat: this.format,
    };
  }
}

const getTableData = (row, values) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(index + 1, 'center', 'text').getCell(),
      new Cell(item?.strPayee, 'left', 'text').getCell(),
      new Cell(item?.strBankAccountNo, 'right', 'text').getCell(),
      new Cell(item?.numAmount, 'right', 'money').getCell(),
      new Cell(item?.strPayBankCode || '', 'left', 'text').getCell(),
      new Cell(item?.strNaration || '', 'left', 'text').getCell(),
      new Cell(item?.strEmail || '', 'left', 'text').getCell(),
    ];
  });
  return data;
};

export const formatSeven = (
  values,
  row,
  selectedBusinessUnit,
  total,
  totalInWords,
  adviceBlobData,
  fileName
) => {
  const excel = {
    name: 'Bank Advice',
    sheets: [
      {
        name: 'Bank Advice',
        gridLine: false,
        rows: [
          // [
          //   {
          //     text: selectedBusinessUnit?.label,
          //     fontSize: 16,
          //     bold: true,
          //     cellRange: "A1:M1",
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
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "center:middle",
          //   },
          // ],
          // ["_blank*2"],
          // [
          //   {
          //     text: "To",
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:K1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          //   {
          //     text: dateFormatWithMonthName(_todayDate()),
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "L1:M1",
          //     merge: true,
          //   },
          // ],
          // [
          //   {
          //     text: "The Manager",
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: values?.bankAccountNo?.bankName,
          //     fontSize: 9,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: values?.bankAccountNo?.address,
          //     fontSize: 9,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: "Subject : Payment Instruction by BEFTN",
          //     fontSize: 9,
          //     bold: true,
          //     underline: true,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: "Dear Sir,",
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: `We do hereby requesting you to make payment by transferring the amount to the respective Account Holder as shown below in detailed`,
          //     fontSize: 8,
          //     bold: true,
          //     italic: true,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: `by debiting our CD Account No. ${values?.bankAccountNo?.bankAccNo}`,
          //     fontSize: 8,
          //     bold: true,
          //     italic: true,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // [
          //   {
          //     text: "Detailed particulars of each Account Holder:",
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          [
            {
              text: 'SL',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Payee Name',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Payee Account No',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Amount (USD)',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Payee Bank Code',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Reason',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Email',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
          ],
          ...getTableData(row, values),
          // [
          //   {
          //     text: "Total",
          //     fontSize: 7,
          //     bold: true,
          //     border: "all 000000 thin",
          //     alignment: "left:middle",
          //   },
          //   {
          //     text: "",
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: "",
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: total,
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //     bold: true,
          //     alignment: "right:middle",
          //     textFormat: "money",
          //   },
          //   {
          //     text: "",
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: "",
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //   },
          //   {
          //     text: "",
          //     fontSize: 7,
          //     border: "all 000000 thin",
          //   },
          // ],
          // ["_blank*1"],
          // [
          //   {
          //     text: `In Word : ${totalInWords} Taka Only.`,
          //     fontSize: 9,
          //     bold: true,
          //     cellRange: "A1:M1",
          //     merge: true,
          //     alignment: "left:middle",
          //   },
          // ],
          // ["_blank*1"],
          // [
          //   {
          //     text: `For : ${selectedBusinessUnit?.label}`,
          //     fontSize: 10,
          //     bold: true,
          //     cellRange: "A1:M1",
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
