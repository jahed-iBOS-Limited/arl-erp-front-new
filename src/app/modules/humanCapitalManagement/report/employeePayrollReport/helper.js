import Axios from "axios";

export const getReportGridData = async (
  buId,
  monId,
  yrId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/hcm/EmployeePayroll/GetEmployeePayrollReport?BusinessUnitId=${buId}&MonthId=${monId}&YearId=${yrId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getReportForRowData = async (payId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeePayroll/GetEmployeeSalaryAdvice?PayrollId=${payId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
