import axios from "axios";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { generateJsonToExcel } from "../../../_helper/excel/jsonToExcel";
import moment from "moment";

export const GetExpenseReport_api = async (
  buId,
  reportType,
  empId,
  fromDate,
  toDate,
  status,
  userId,
  expCode,
  expenseGroup,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const urlOne = `/fino/ExpenseTADA/GetExpenseReport?Unitid=${buId}&partid=${reportType}&employeeid=${empId}&FromDate=${fromDate}&Todate=${toDate}&isBillSubmitted=${status}&ReportViewBy=${userId}&ExpenseGroup=${expenseGroup}`;

    const urlTwo = `/fino/ExpenseTADA/GetExpenseInfoForHRapprove?businessUnitId=${buId}&partId=${reportType}&employeeId=${empId}&fromDate=${fromDate}&toDate=${toDate}&isBillSubmitted=${status}&ReportViewBy=${userId}&ExpenseGroup=${expenseGroup}`;

    const urlThree = `fino/ExpenseTADA/GetExpenseBillStatus?Unitid=4&partid=${reportType}&employeeid=${empId}&FromDate=${fromDate}&Todate=${toDate}&ReportViewBy=${userId}&ExpenseCode=${expCode ||
      "empty"}&ExpenseGroup=${expenseGroup}`;

    const url = [1, 2, 3, 4, 16].includes(reportType)
      ? urlOne
      : [14].includes(reportType)
      ? urlTwo
      : urlThree;

    const res = await axios.get(url);
    if (res?.data?.length < 1) toast.warn("Data Not Found");
    // ci sl to response data
    const updatedData = res?.data?.map((item, index) => ({
      ...item,
      sl: index + 1,
      dteSupervisorAprvdate: moment(item?.dteSupervisorAprvdate).format(
        "YYYY-MM-DD, LT"
      ),
      dteLineManagerAprvdate: moment(item?.dteLineManagerAprvdate).format(
        "YYYY-MM-DD, LT"
      ),
      dteExpenseDate: moment(item?.dteExpenseDate).format("YYYY-MM-DD")
    }));
    setter(updatedData);
    cb && cb();
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const approveExpense = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/fino/Expense/ExpenseRegisterApproveByHR`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const usePrintHandler = () => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "expense top sheet (HR)",
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; display: block; margin: 0mm;}@page {size: portrait ! important}}",
  });

  return { handlePrint, printRef };
};

// table 1 for 1,2,3,4,12
export const table1 = [
  {
    text: "SL",
    textFormat: "number",
    alignment: "center:middle",
    key: "sl",
  },
  {
    text: "Enroll",
    textFormat: "number",
    alignment: "left:middle",
    key: "intExpenseForId",
  },
  {
    text: "Employee Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "strEmployeeFullName",
  },
  {
    text: "Designation",
    textFormat: "text",
    alignment: "left:middle",
    key: "strDesignation",
  },
  {
    text: "Routing",
    textFormat: "number",
    alignment: "left:middle",
    key: "strRouting",
  },
  {
    text: "Account Number",
    textFormat: "number",
    alignment: "left:middle",
    key: "strAccountNumber",
  },
  {
    text: "Bank Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "strBank",
  },
  {
    text: "Branch",
    textFormat: "text",
    alignment: "left:middle",
    key: "strBranch",
  },
  {
    text: "Contact Number",
    textFormat: "text",
    alignment: "left:middle",
    key: "strContactNumber",
  },
  {
    text: "Supervisor",
    textFormat: "text",
    alignment: "left:middle",
    key: "strsupervisor",
  },
  {
    text: "Workplace Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "strWorkplaceName",
  },
  {
    text: "Advance Amount",
    textFormat: "number",
    alignment: "right:middle",
    key: "numAdvanceAmount",
  },
  {
    text: "Expense Code",
    textFormat: "number",
    alignment: "left:middle",
    key: "strexpensecode",
  },
  {
    text: "Applicant Amount",
    textFormat: "number",
    alignment: "right:middle",
    key: "numApplicantAmount",
  },
  {
    text: "Approve By HR",
    textFormat: "number",
    alignment: "right:middle",
    key: "numApprvByHR",
  },
  {
    text: "Approve By Supervisor",
    textFormat: "number",
    alignment: "right:middle",
    key: "numApprvBySuppervisor",
  },
  {
    text: "Supervisor Approve Date",
    textFormat: "text",
    alignment: "left:middle",
    key: "dteSupervisorAprvdate",
  },
  {
    text: "Line Manager Approve Date",
    textFormat: "text",
    alignment: "left:middle",
    key: "dteLineManagerAprvdate",
  },
  {
    text: "Net Payable",
    textFormat: "text",
    alignment: "right:middle",
    key: "numNetPayable",
  },
  {
    text: "Bill Register Code",
    textFormat: "text",
    alignment: "left:middle",
    key: "strBillRegisterCode",
  },
];

// table 2 for 5,6,7,8,9
export const table2 = [
  {
    text: "SL",
    textFormat: "number",
    alignment: "center:middle",
    key: "sl",
  },
  {
    text: "Enroll",
    textFormat: "number",
    alignment: "left:middle",
    key: "intExpenseForId",
  },
  {
    text: "Employee Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "strEmployeeFullName",
  },
  {
    text: "Designation",
    textFormat: "text",
    alignment: "left:middle",
    key: "strDesignationName",
  },
  {
    text: "Expense Code",
    textFormat: "text",
    alignment: "center:middle",
    key: "strExpenseCode",
  },
  {
    text: "Expense Date",
    textFormat: "date",
    alignment: "center:middle",
    key: "dteExpenseDate",
  },
  {
    text: "Expense Location",
    textFormat: "text",
    alignment: "left:middle",
    key: "strExpenseLocation",
  },
  {
    text: "Status",
    textFormat: "text",
    alignment: "left:middle",
    key: "StatusofBill",
  },
  {
    text: "Email",
    textFormat: "email",
    alignment: "left:middle",
    key: "strEmail",
  },
  {
    text: "Contact Number",
    textFormat: "text",
    alignment: "left:middle",
    key: "strContactNumber",
  },
  {
    text: "Supervisor",
    textFormat: "text",
    alignment: "left:middle",
    key: "strSupervisorName",
  },
  {
    text: "Supervisor Phone Number",
    textFormat: "text",
    alignment: "left:middle",
    key: "supervisorPhone",
  },

  {
    text: "Workplace Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "strWorkplaceName",
  },
  {
    text: "Advance Amount",
    textFormat: "number",
    alignment: "right:middle",
    key: "numAdvanceAmount",
  },
  {
    text: "Applicant Amount",
    textFormat: "number",
    alignment: "right:middle",
    key: "numApplicantAmount",
  },
  {
    text: "Approve By Supervisor",
    textFormat: "number",
    alignment: "right:middle",
    key: "numSupervisorAmount",
  },
  {
    text: "Approve By HR",
    textFormat: "number",
    alignment: "right:middle",
    key: "numLineManagerAmount",
  },
  {
    text: "Net Payable",
    textFormat: "number",
    alignment: "right:middle",
    key: "numNetPayable",
  },
  {
    text: "Expense Group",
    textFormat: "text",
    alignment: "left:middle",
    key: "strExpenseGroup",
  },
  {
    text: "Bill ID",
    textFormat: "text",
    alignment: "left:middle",
    key: "rhintBillId",
  },
];

// table 3 for 10
export const table3 = [
  {
    text: "SL",
    textFormat: "number",
    alignment: "center:middle",
    key: "sl",
  },
  {
    text: "Employee Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "EmployeeFullName",
  },
  {
    text: "Employee Id",
    textFormat: "number",
    alignment: "left:middle",
    key: "intExpenseForId",
  },
  {
    text: "Supervisor Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "SupervisorFullName",
  },
  {
    text: "Supervisor Business Unit",
    textFormat: "text",
    alignment: "left:middle",
    key: "SupBusinessUnitName",
  },
  {
    text: "Expense Date",
    textFormat: "date",
    alignment: "left:middle",
    key: "dteExpenseDate",
  },
  {
    text: "Expense Group",
    textFormat: "text",
    alignment: "left:middle",
    key: "strExpenseGroup",
  },
  {
    text: "Bill Submitted",
    textFormat: "boolean",
    alignment: "left:middle",
    key: "isBillSubmitted",
  },
  {
    text: "Line Manager Approve",
    textFormat: "text",
    alignment: "left:middle",
    key: "strLineManagerApprove",
  },
  {
    text: "Supervisor Approve",
    textFormat: "left",
    alignment: "center:middle",
    key: "strSupervisorApprove",
  },
  {
    text: "Status",
    textFormat: "text",
    alignment: "left:middle",
    key: "isActive",
    transform: (item) =>
      item?.isHeaderActive && item?.isRowActive ? "Active" : "Inactive",
  },
  {
    text: "Comment",
    textFormat: "text",
    alignment: "center:middle",
    key: "Comments",
  },
];

// table 4 for 14
export const table4 = [
  {
    text: "SL",
    textFormat: "number",
    alignment: "center:middle",
    key: "sl",
  },
  {
    text: "Unit Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "strUnit",
  },
  {
    text: "Business Unit Name",
    textFormat: "text",
    alignment: "left:middle",
    key: "strSBUName",
  },
  {
    text: "Application Amount",
    textFormat: "number",
    alignment: "right:middle",
    key: "numApplicantAmount",
    options: { decimalPlaces: 0 },
  },
  {
    text: "Approved by Supervisor",
    textFormat: "number",
    alignment: "right:middle",
    key: "numApprvBySuppervisor",
    options: { decimalPlaces: 0 },
  },
  {
    text: "Approved by Line Manager",
    textFormat: "number",
    alignment: "right:middle",
    key: "numLineManagerAprv",
    options: { decimalPlaces: 0 },
  },
  {
    text: "Approved by HR",
    textFormat: "number",
    alignment: "right:middle",
    key: "numApprvByHR",
    options: { decimalPlaces: 0 },
  },
];

// export excel click handler to export expense report excel sheet
export const exportExpenseReport = (values, gridData) => {
  const reportType = values?.reportType?.value;
  const tableHeader = chooseTableHeader(reportType);

  // generate
  generateJsonToExcel(tableHeader, gridData, "ExpenseReport");
};

// choose excel sheet to generate
export const chooseTableHeader = (reportType) => {
  switch (reportType) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 12:
      return table1;
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return table2;
    case 10:
      return table3;
    case 14:
      return table4;
    default:
      return false;
  }
};
