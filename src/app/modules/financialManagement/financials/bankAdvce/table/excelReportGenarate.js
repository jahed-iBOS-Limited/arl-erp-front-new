import { Workbook } from "exceljs";
import * as fs from "file-saver";
// import { inWords } from "../../../../_helper/_convertMoneyToWord";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";
import { excelGenerator } from "./excelGenerator";
import axios from "axios";
import { toast } from "react-toastify";

const createExcelFile = async (
  isHeaderNeeded,
  comapanyNameHeader,
  dataHeader,
  tableHeader,
  tableData,
  tableBottom,
  bottom1,
  bottom2,
  bottom3,
  getBlobData,
  fileName,
  isOldExcelDownload
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
    worksheet.getCell("A3").alignment = {
      horizontal: "left",
      wrapText: true,
    };
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

    const _bottom2 = worksheet.addRow(bottom2);
    _bottom2.font = { size: 11, bold: true };
    worksheet.mergeCells(`A${_bottom2.number}:L${_bottom2.number}`);

    worksheet.addRow();
    worksheet.addRow();
    let _bottom3 = worksheet.addRow(bottom3);
    worksheet.mergeCells(`A${_bottom3.number}:L${_bottom3.number}`);
  }

  // worksheet.mergeCells(`D${bottom3.number}:F${bottom3.number}`);
  if (isOldExcelDownload) {
    excelDownlaod({ workbook, fileName });
  } else {
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: "application/ms-excel",
      });
      if (getBlobData) {
        getBlobData(blob);
      } else {
        fs.saveAs(blob, `${fileName}.xlsx`);
      }
    });
  }
};

const excelDownlaod = async ({ workbook, fileName }) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const formData = new FormData();
  formData.append("file", blob, `${fileName}.xlsx`);
  const url = `https://automation.ibos.io/convert_xlsx_to_xls/`;
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        // If the response contains a PDF file
        if (
          response.headers.get("content-type") === "application/vnd.ms-excel"
        ) {
          // Extract the filename from the response headers
          const filename = `${fileName}-new.xls`;
          // Return a promise with the response blob
          return response.blob().then((blob) => {
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);
            // Create a link element to trigger the download
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            // Append the link to the body and trigger the download
            document.body.appendChild(link);
            link.click();
            // Clean up by revoking the object URL
            window.URL.revokeObjectURL(url);
            toast.success("File downloaded successfully as:", filename);
          });
        } else {
          toast.warn("Request Failed");
        }
      } else {
        toast.error("Request failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getTableData = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    item["slNo"] = index + 1;
    return keys?.map((key) => item[key]);
  });
  return data;
};

export const generateExcel = (
  row,
  values,
  total,
  totalInWords,
  selectedBusinessUnit,
  isHeaderNeeded,
  getBlobData,
  fileName,
  isOldExcelDownload
) => {
  row.forEach((item) => {
    item["debitAccount"] = values?.bankAccountNo?.bankAccNo;
  });
  const dataHeader = [
    `To\nDate: ${dateFormatWithMonthName(_todayDate())}\nThe Manager\n${
      values?.bankAccountNo?.bankName
    }.\n${values?.bankAccountNo?.address}\nSubject : ${
      values?.advice?.info === "ibbl"
        ? "Payment Instruction."
        : "Payment Instruction by BEFTN."
    }\nDear Sir,\nWe do hereby requesting you to make payment by transferring the amount to the respective Account Holder as shown below in detailed by debiting our CD Account No.${
      values?.bankAccountNo?.bankAccNo
    }\nDetailed particulars of each Account Holder:`,
  ];

  let tableColumnInfo = {};
  switch (values?.advice?.info) {
    case "ibblBEFTN":
    case "primeBEFTN":
      tableColumnInfo = {
        strBankAccountName: "Account Name",
        strPayeCode: "Code No",
        strBankName: "Bank Name",
        strBankBranchName: "Branch Name",
        strBankAccType: "A/C Type",
        strBankAccountNo: "Account No",
        numAmount: "Amount",
        strPaymentReff: "Payment Info",
        strComments: "Comments",
        strRoutingNumber: "Routing No",
        strInstrumentNo: "Instrument No",
        slNo: "SL No",
      };
      break;
    case "ibbl":
    case "prime":
      tableColumnInfo = {
        slNo: "Sl No",
        strAccountNo: "Account No",
        strBankAccountName: "Account Name",
        numAmount: "Amount",
        strInstrumentNo: "Instrument No",
        strBankBranchName: "Branch",
      };
      break;
    case "scb":
      tableColumnInfo = {
        strBankAccountName: "Account Name",
        strPayeCode: "Code No",
        strBankName: "Bank Name",
        strBankBranchName: "Branch Name",
        strBankAccType: "A/C Type",
        strBankAccountNo: "Account No",
        numAmount: "Amount",
        strPaymentReff: "Payment Info",
        strComments: "Comments",
        strRoutingNumber: "Routing No",
        strInstrumentNo: "Instrument No",
        slNo: "SL No",
        debitAccount: "Debit Account",
      };
      break;
    case "above36Character":
      tableColumnInfo = {
        slNo: "SL",
        strPayee: "Payee Name",
        strBankAccountNo: "Payee Account No",
        numAmount: "Amount (USD)",
        strPayBankCode: "Payee Bank Code",
        strNaration: "Reason",
        strEmail: "Email",
      };
      break;
    case "below36Character":
      tableColumnInfo = {
        slNo: "SL",
        strPayee: "Payee Name",
        strBankAccountNo: "Payee Account No",
        numAmount: "Amount (USD)",
        strPayBankCode: "Payee Bank Code",
        strNaration: "Reason",
        strEmail: "Email",
      };
      break;
    case "import":
      tableColumnInfo = {
        slNo: "SL",
        strRequestFor: "Request For",
        strNaration: "Description",
        numAmount: "Debiting Amount",
      };
      break;
    default:
      break;
  }
  const tableDataInfo = getTableData(
    row,
    Object.keys(tableColumnInfo),
    "numAmount"
  );
  let tableBottom = [];
  let bottom3 = [];
  switch (values?.advice?.info) {
    case "ibblBEFTN":
      tableBottom = ["", "", "", "", "", "Total", total, "", "", "", "", ""];
      bottom3 = ["Authorize Signature                  Authorize Signature"];
      break;
    case "ibbl":
      tableBottom = ["", "", "Total", total, "", ""];
      bottom3 = ["Authorize Signature                  Authorize Signature"];
      break;
    case "scb":
      tableBottom = [
        "",
        "",
        "",
        "",
        "",
        "Total",
        total,
        "",
        "",
        "",
        "",
        "",
        "",
      ];
      bottom3 = [
        "Authorize Signature                  Authorize Signature                  Authorize Signature",
      ];
      break;
    default:
      break;
  }


  const bottom1 = [`In Word : ${totalInWords} Taka Only`];
  const bottom2 = [`For ${selectedBusinessUnit?.label}`];

  if (
    values?.advice?.info === "ibblBEFTN" ||
    values?.advice?.info === "ibbl" ||
    values?.advice?.info === "primeBEFTN" ||
    values?.advice?.info === "prime" ||
    values?.advice?.info === "scb" ||
    values?.advice?.info === "above36Character" ||
    values?.advice?.info === "below36Character" ||
    values?.advice?.info === "import"
  ) {
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
      getBlobData,
      fileName,
      isOldExcelDownload
    );
  } else {
    excelGenerator(
      values,
      row,
      selectedBusinessUnit,
      total,
      totalInWords,
      null,
      fileName
    );
  }
};
