import moment from 'moment';
const ExcelJS = require('exceljs');

const columnTitle = [
    {
        text: 'SL',
        fontSize: 10,
        bold: true,
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        type: "text"
    },
    {
        text: 'Bank Account Name',
        fontSize: 10,
        bold: true,
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        width: 38,

    },
    {
        text: 'Credit Amount',
        fontSize: 10,
        bold: true,
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        width: 15,
        type: 'number',
    },
    {
        text: 'Debit Amount',
        fontSize: 10,
        bold: true,
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        width: 15,
        type: 'number',
    },
    {
        text: 'Current Balance',
        fontSize: 10,
        bold: true,
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        width: 15,
        type: 'number',
    },
];

export const BankStatementSummaryExcel = async (excelData) => {
    const dataRows = excelData.map((data, idx) => {
        return {
            sl: idx + 1,
            bankAccount: data.bankAccount,
            debitAmount: data.debitAmount,
            creditAmount: Math.abs(data.creditAmount),
            currentBalance: data.currentBalance,
        };
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bank Statement Summary');
    const titleRow = worksheet.addRow(columnTitle.map(column => column.text));
    titleRow.font = { size: 10, bold: true };
    worksheet.columns.forEach((column, index) => {
        if (columnTitle[index].width) {
            column.width = columnTitle[index].width;
        }
    });

    dataRows.forEach((data, idx) => {
        const theRow = worksheet.addRow([
            Math.abs(idx + 1),
            data.bankAccount,
            data.debitAmount,
            data.creditAmount,
            data.currentBalance,
        ]);
        theRow.getCell(1).numFmt = "@";
        theRow.getCell(2).numFmt = "@";
        theRow.getCell(3).numFmt = '0.00';
        theRow.getCell(4).numFmt = '0.00';
        theRow.getCell(5).numFmt = '0.00';
    });

    const rows = worksheet.getRow(1);
    for (let i = 0; i < 5; i++) {
        rows.getCell(i + 1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFF00" },
        };
    }

    const totalSum = dataRows.reduce((sum, row) => {
        return {
            debitAmount: (+sum.debitAmount || 0) + (+ row.debitAmount || 0),
            creditAmount: (+sum.creditAmount || 0) + (+ row.creditAmount || 0),
            currentBalance: (+sum.currentBalance || 0) + (+ row.currentBalance || 0),
        };
    }, { debitAmount: 0, creditAmount: 0, currentBalance: 0, });

    const totalRow = worksheet.addRow(['Total', '', +totalSum?.debitAmount, +totalSum.creditAmount, +totalSum.currentBalance]);
    const negativeNumberFormat = "0.00";
    const textFormat = "@";
    totalRow.getCell(1).numFmt = textFormat;
    totalRow.getCell(3).numFmt = negativeNumberFormat;
    totalRow.getCell(4).numFmt = negativeNumberFormat;
    totalRow.getCell(5).numFmt = negativeNumberFormat;
    worksheet.mergeCells(`A${dataRows.length + 2}:B${dataRows.length + 2}`);
    const totalCell = worksheet.getCell(`A${dataRows.length + 2}`);
    totalCell.alignment = { horizontal: 'right' };
    // Save the workbook
    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        // download the file
        const a = document.createElement("a");
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `Bank-Statement-${moment().format("l")}`;
        a.click();
    });
}