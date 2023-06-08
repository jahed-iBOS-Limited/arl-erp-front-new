import axios from "axios";
import { toast } from "react-toastify";

export const getBankDDl = async (setter) => {
  try {
    let res = await axios.get(`/costmgmt/BankAccount/GETBankDDl`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const branchListAPiCaller = async (bankId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${bankId}&CountryId=18`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getBankAccountDDL = async (
  accId,
  buId,
  bankId,
  branchId,
  setter
) => {
  try {
    const res = await axios.get(
      `/fino/FinanceCommonDDL/GetBankAccNoDDL?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveBankChequePrint = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    const res = await axios.post(
      `/fino/BankChequePrint/SaveBankChequePrint`,
      payload
    );

    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message || "Submitted Successfully");
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setIsLoading(false);
  }
};

export const getBankChequePrintPagination = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/BankChequePrint/BankChequePrintPagination?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setLoading(false);
  }
};
