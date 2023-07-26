import axios from "axios";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

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
  setLoading, cb
) => {
  setLoading(true);
  try {
    const url = [1, 2, 3, 4, 14, 16].includes(reportType)
      ? `/fino/ExpenseTADA/GetExpenseReport?Unitid=${buId}&partid=${reportType}&employeeid=${empId}&FromDate=${fromDate}&Todate=${toDate}&isBillSubmitted=${status}&ReportViewBy=${userId}&ExpenseGroup=${expenseGroup}`
      : `fino/ExpenseTADA/GetExpenseBillStatus?Unitid=4&partid=${reportType}&employeeid=${empId}&FromDate=${fromDate}&Todate=${toDate}&ReportViewBy=${userId}&ExpenseCode=${expCode ||
          "empty"}&ExpenseGroup=${expenseGroup}`;

    const res = await axios.get(url);
    if (res?.data?.length < 1) toast.warn("Data Not Found");
    setter(res?.data);
    cb && cb()
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
