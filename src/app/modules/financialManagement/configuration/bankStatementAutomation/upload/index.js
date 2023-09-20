import * as ExcelJS from "exceljs";
import { Formik } from "formik";
import moment from "moment/moment";
import React from "react";
import * as Yup from "yup";
import ICustomCard from "./../../../../_helper/_customCard";
const validationSchema = Yup.object().shape({
  tradeType: Yup.object().shape({
    label: Yup.string().required("Trade Type is required"),
    value: Yup.string().required("Trade Type is required"),
  }),
});

function BankStatementAutomationloadExcel({ objProps }) {
  const { uploadHandelar, rowDto } = objProps;
  const hiddenFileInput = React.useRef(null);

  const exportToExcel = () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Add a new worksheet
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add some rows and columns
    worksheet.columns = [
      { header: "Transaction Date", key: "transactionDate", width: 15 },
      { header: "Particular", key: "particulars", width: 15 },
      { header: "Instrument No", key: "instrumentNo", width: 15 },
      { header: "Credit", key: "monCredit", width: 15 },
      { header: "Debit", key: "monDebit", width: 15 },
      { header: "Balance", key: "monBalance", width: 15 },
      {
        header: "Row Id (If it's a new row insert, then assign a row ID of 0.)",
        key: "rowId",
        width: 20,
      },
    ];
    // first row color add
    const rows = worksheet.getRow(1);
    for (let i = 0; i < 7; i++) {
      rows.getCell(i + 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
      };
    }

    // Add rowDto using key
    rowDto.forEach((item, index) => {
      worksheet.addRow({
        transactionDate: new Date(item?.transactionDate),
        particulars: item?.particulars,
        instrumentNo: item?.instrumentNo,
        monCredit: item?.monCredit,
        monDebit: item?.monDebit,
        monBalance: item?.monBalance,
        rowId: item?.rowId,
      });
    });
    // Apply data validation to cells in columns A and D for rows 2 to 100
    for (let row = 2; row <= 200; row++) {
      // Transaction Date data validation
      const cellA = worksheet.getCell(`A${row}`);
      cellA.dataValidation = {
        type: "date",
        showDropDown: true,
        errorTitle: "Invalid Date",
        error: "Please enter a valid date in MM/DD/YYYY format.",
        showErrorMessage: true,
        formula1: 'AND(ISNUMBER(B2), LEN(TEXT(B2, "MM/DD/YYYY"))=10)',
      };

      // Credit data validation
      const cellD = worksheet.getCell(`D${row}`);
      cellD.dataValidation = {
        type: "decimal",
        allowBlank: false,
        error: "Please use input the valid value",
        errorTitle: "Invalid Selection",
        showErrorMessage: true,
        promptTitle: "Decimal",
      };

      // Debit data validation
      const cellE = worksheet.getCell(`E${row}`);
      cellE.dataValidation = {
        type: "decimal",
        allowBlank: false,
        error: "Please use input the valid value",
        errorTitle: "Invalid Selection",
        showErrorMessage: true,
        promptTitle: "Decimal",
      };
      // Balance data validation
      const cellF = worksheet.getCell(`F${row}`);
      cellF.dataValidation = {
        type: "decimal",
        allowBlank: false,
        error: "Please use input the valid value",
        errorTitle: "Invalid Selection",
        showErrorMessage: true,
        promptTitle: "Decimal",
      };
    }

    // Save the workbook
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // download the file
      const a = document.createElement("a");
      document.body.appendChild(a);
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `BankStatementAutomation-${moment().format("l")}`;
      a.click();
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
      validationSchema={validationSchema}
    >
      {({ errors, touched, setFieldValue, isValid, values, handleSubmit }) => (
        <ICustomCard
          title='Bank Statement Automation Upload'
          renderProps={() => {
            return (
              <>
                <button
                  className='btn btn-primary mr-1'
                  onClick={() => {
                    exportToExcel();
                  }}
                  type='button'
                >
                  <i className='fa fa-download'></i> Download Excel Format
                </button>
                <button
                  className='btn btn-primary mr-1'
                  onClick={() => {
                    hiddenFileInput.current.click();
                  }}
                  type='button'
                >
                  <i className='fa fa-upload'></i>
                  Import Excel
                </button>
                <input
                  type='file'
                  onChange={async (e) => {
                    uploadHandelar(e.target.files[0], values);

                    hiddenFileInput.current.value = "";
                  }}
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                  accept='.csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                />
              </>
            );
          }}
        ></ICustomCard>
      )}
    </Formik>
  );
}

export default BankStatementAutomationloadExcel;
