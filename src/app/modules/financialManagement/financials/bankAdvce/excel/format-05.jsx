import { Workbook } from "exceljs";
import * as fs from "file-saver";
// import { inWords } from "../../../../_helper/_convertMoneyToWord";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";

const createExcelFile = (
  isHeaderNeeded,
  comapanyNameHeader,
  dataHeader,
  tableHeader,
  tableData,
  tableBottom,
  bottom1,
  bottom2,
  bottom3,
  adviceBlobData,
  fileName
) => {
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet("Bank Advice");
  if (isHeaderNeeded) {
    let companyName = worksheet.addRow([comapanyNameHeader]);
    companyName.font = { size: 20, underline: "single", bold: true };
    worksheet.mergeCells("A1:L1");
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    let companyLocation = worksheet.addRow([
      "Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.",
    ]);
    companyLocation.font = { size: 14, underline: "single", bold: true };
    worksheet.mergeCells("A2:L2");
    worksheet.getCell("A2").alignment = { horizontal: "center" };

    worksheet.addRow(dataHeader);
    worksheet.mergeCells("A3:L14");
    worksheet.getCell("A3").alignment = { horizontal: "left", wrapText: true };
    worksheet.addRow([]);
    worksheet.mergeCells("A15:L15");
  }

  // let applicationHeader = worksheet.addRow([dataHeader]);

  let codeNo = 0;
  let accountNo = 0;
  let amount = "#";
  let routingNo = "#";
  let _tableHeader = worksheet.addRow(tableHeader);
  _tableHeader.font = { bold: true };
  _tableHeader.eachCell((cell) => {
    cell.alignment = { horizontal: "center" };
    if (cell.value === "Code No") {
      codeNo = cell._address[0];
    } else if (cell.value === "Account No") {
      accountNo = cell?._address[0];
    } else if (cell.value === "Amount") {
      amount = cell?._address[0];
    } else if (cell.value === "Routing No") {
      routingNo = cell?._address[0];
    }
    worksheet.getCell(`${cell._address}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  // console.log(routingNo)
  const _tableData = worksheet.addRows(tableData);
  _tableData.forEach((row) => {
    row.eachCell((cell) => {
      if (cell._address[0] === codeNo) {
        cell.alignment = { horizontal: "right" };
      }
      if (cell._address[0] === amount) {
        cell.numFmt = "#,##0.00";
      }
      if (cell._address[0] === accountNo) {
        cell.numFmt = "@";
      }
      if (cell._address[0] === routingNo) {
        cell.numFmt = "@";
      }
      worksheet.getCell(`${cell._address}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  if (isHeaderNeeded) {
    const _tableBottom = worksheet.addRow(tableBottom);
    _tableBottom.font = { bold: true };
    _tableBottom.eachCell((cell) => {
      cell.numFmt = "#,##0.00";
      worksheet.getCell(`${cell._address}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    worksheet.addRow();

    const _bottom1 = worksheet.addRow(bottom1);
    _bottom1.font = { size: 11, bold: true };
    worksheet.mergeCells(`A${_bottom1.number}:L${_bottom1.number}`);
    worksheet.addRow();
    const _bottom12 = worksheet.addRow(["Yours faithfully"]);
    _bottom12.font = { size: 11, bold: true };
    worksheet.mergeCells(`A${_bottom12.number}:L${_bottom12.number}`);

    const _bottom2 = worksheet.addRow(bottom2);
    _bottom2.font = { size: 13, bold: true };
    worksheet.mergeCells(`A${_bottom2.number}:L${_bottom2.number}`);

    worksheet.addRow();
    worksheet.addRow();
    let _bottom3 = worksheet.addRow(bottom3);
    worksheet.mergeCells(`A${_bottom3.number}:L${_bottom3.number}`);
  }

  // worksheet.mergeCells(`D${bottom3.number}:F${bottom3.number}`);
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    if(adviceBlobData){
      adviceBlobData(blob)
    }else{
      fs.saveAs(blob,  `${fileName}.xls`);
    }
  });
};

const getTableData = (row) => {
  const data = row?.map((item, index) => {
    return [
      index + 1,
      item?.strInstrumentNo,
      "Issue a Pay Order in favour of " + item?.strPayee,
      item?.numAmount,
    ];
  });
  return data;
};

export const formatFive = (
  row,
  values,
  total,
  totalInWords,
  selectedBusinessUnit,
  isHeaderNeeded,
  adviceBlobData,
  fileName
) => {
  row.forEach((item) => {
    item["debitAccount"] = values?.bankAccountNo?.bankAccNo;
  });
  const dataHeader = [
    `Date: ${dateFormatWithMonthName(_todayDate())}\nTo\nThe Manager\n${
      values?.bankAccountNo?.bankName
    }.\n${
      values?.bankAccountNo?.address
    }\nSubject: Subject: Request to Debit our account by settleing as per instructions.\nDear Sir,\nAssalamu-Alaikum.\nYou are requestd to debit our account No: ${
      values?.bankAccountNo?.bankAccNo
    } by settling as per instructions below:`,
  ];

  let tableColumnInfo = {
    slNo: "SL No.",
    strInstrumentNo: "Ref:",
    strBankName: "Description",
    strBankBranchName: "Debiting Amt.",
  };

  const tableDataInfo = getTableData(row);
  const tableBottom = ["", "", "Total", total];
  const bottom3 = ["Authorize Signature                  Authorize Signature"];

  const bottom1 = [
    `In Word : ${totalInWords} Taka Only`,
  ];
  const bottom2 = [`For ${selectedBusinessUnit?.label}`];
  createExcelFile(
    isHeaderNeeded,
    selectedBusinessUnit?.label,
    dataHeader,
    Object.values(tableColumnInfo),
    tableDataInfo,
    tableBottom,
    bottom1,
    bottom2,
    bottom3,
    adviceBlobData,
    fileName
  );
};
