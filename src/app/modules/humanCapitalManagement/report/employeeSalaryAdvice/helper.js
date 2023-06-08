import Axios from "axios";

export const getReportGridData = async (
  buId,
  monId,
  yrId,
  bankName,
  accounty,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/hcm/EmployeePayroll/GetEmployeePayrollReportByBank?BusinessUnitId=${buId}&MonthId=${monId}&YearId=${yrId}&BankName=${bankName}`
    );
    const newData = res?.data?.map((itm) => {
      return {
        ...itm,
        accounty: accounty,
      };
    });
    setter(newData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getBankDDLData = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/GetBankNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBranchDDLData = async (accId, buId, bankId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/GetBankBranchNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBankAccountDDLData = async (
  accId,
  buId,
  bankId,
  branchId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/FinanceCommonDDL/GetBankAccNoDDL?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
