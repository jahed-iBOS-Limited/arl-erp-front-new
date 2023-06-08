import axios from "axios";
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
  setLoading
) => {
  setLoading(true);
  try {
    const url = [1, 2, 3, 4].includes(reportType)
      ? `/fino/ExpenseTADA/GetExpenseReport?Unitid=${buId}&partid=${reportType}&employeeid=${empId}&FromDate=${fromDate}&Todate=${toDate}&isBillSubmitted=${status}&ReportViewBy=${userId}&ExpenseGroup=${expenseGroup}`
      : `fino/ExpenseTADA/GetExpenseBillStatus?Unitid=4&partid=${reportType}&employeeid=${empId}&FromDate=${fromDate}&Todate=${toDate}&ReportViewBy=${userId}&ExpenseCode=${expCode ||
          "empty"}&ExpenseGroup=${expenseGroup}`;

    const res = await axios.get(url);
    if (res?.data?.length < 1) toast.warn("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
