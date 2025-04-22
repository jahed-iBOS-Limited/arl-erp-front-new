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
      new Cell(item?.strBankAccountName, 'left', 'text').getCell(),
      new Cell(item?.strPayeCode, 'right', 'text').getCell(),
      new Cell(item?.strBankName, 'left', 'text').getCell(),
      new Cell(item?.strBankBranchName, 'left', 'text').getCell(),
      new Cell(item?.strBankAccType, 'left', 'text').getCell(),
      new Cell(item?.strBankAccountNo, 'left', 'text').getCell(),
      new Cell(item?.numAmount, 'right', 'money').getCell(),
      new Cell(item?.strPaymentReff || 'N/A', 'left', 'text').getCell(),
      new Cell(item?.strComments, 'left', 'text').getCell(),
      new Cell(item?.strRoutingNumber, 'left', 'text').getCell(),
      new Cell(item?.strInstrumentNo, 'left', 'text').getCell(),
      new Cell(index + 1, 'center', 'text').getCell(),
      new Cell(values?.bankAccountNo?.bankAccNo, 'center', 'text').getCell(),
    ];
  });
  return data;
};

export const formatThree = (
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
          [
            {
              text: 'Account Name',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Code No',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Bank Name',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Branch Name',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'A/C Type',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Account No',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Amount',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Payment Info',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Comments',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Routing No',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Instrument No',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'SL No',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
            {
              text: 'Debit Account',
              fontSize: 7,
              bold: true,
              border: 'all 000000 thin',
            },
          ],
          ...getTableData(row, values),
        ],
      },
    ],
  };

  createFile(excel, adviceBlobData, fileName);
};
