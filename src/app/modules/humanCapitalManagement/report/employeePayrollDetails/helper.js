import Axios from "axios";

export const getPayrollDetailsGridData = async (
  buId,
  month,
  year,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/hcm/EmployeePayroll/GetEmployeePayrollDetails?BusinessUnitId=${buId}&MonthId=${month}&YearId=${year}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([])
    setLoading(false);
  }
};
