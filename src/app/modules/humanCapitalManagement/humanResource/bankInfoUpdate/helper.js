import Axios from "axios";
import { toast } from "react-toastify";

export const getBankDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetBankDDL");
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getBankBranchDDL_api = async (bankId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBankBranchDDL?BankId=${bankId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const updateEmpBankInfo = async (values, setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.put(
      `/hcm/EmployeeBankInformation/UpdateSingleEmpBankInfo`,
      {
        employeeBankInfoId: values?.employeeBankInfoId,
        employeeId: values?.employee?.value,
        accountName: values?.accountName,
        accountNumber: values?.accountNumber,
        bankId: values?.bank?.value,
        bankName: values?.bank?.label,
        bankBranchId: values?.bankBranch?.value,
        bankBranchName: values?.bankBranch?.label,
        bankRoutingNumber: values?.routingNumber,
      }
    );
    setLoading(false);
    toast.success(res?.data?.message || "Successfully updated");
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Please try again");
  }
};

export const getBankInfoByEmpId = async (
  valueOption,
  values,
  setValues,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/hcm/EmployeeBankInformation/GetSingleEmpBankInfo?EmployeeId=${valueOption?.value}`
    );
    let {
      employeeBankInfoId,
      bankRoutingNumber,
      bankBranchName,
      bankBranchId,
      bankName,
      bankId,
      accountNumber,
      accountName,
    } = res?.data;
    setValues({
      ...values,
      employee: valueOption,
      accountName: accountName,
      accountNumber: accountNumber,
      bank: { value: bankId, label: bankName },
      bankBranch: { value: bankBranchId, label: bankBranchName },
      routingNumber: bankRoutingNumber,
      employeeBankInfoId,
    });
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Not found info");
    setLoading(false);
  }
};
