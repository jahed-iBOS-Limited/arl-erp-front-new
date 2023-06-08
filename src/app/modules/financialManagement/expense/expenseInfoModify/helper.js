import axios from "axios";
import { toast } from "react-toastify";

export const GetExpenseInfoModifyLandingData = async (
  buId,
  partId,
  employeeId,
  fromDate,
  toDate,
  reportViewBy,
  expenseGroup,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/ExpenseTADA/GetExpenseBillStatus?Unitid=${buId}&partid=${partId}&employeeid=${employeeId}&FromDate=${fromDate}&Todate=${toDate}&ReportViewBy=${reportViewBy}&ExpenseCode=""&ExpenseGroup=${expenseGroup}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

export const InactiveExpense = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/fino/InformationModification/UpdateInformation`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};
