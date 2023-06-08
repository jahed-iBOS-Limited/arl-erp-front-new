import { toast } from "react-toastify";
import Axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";

//Bank Account ddl
export const bankAccountDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(`/fino/FinanceCommonDDL/GetBankNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
//Branch Account ddl
export const bankBranchAccountDDL = async (setter, bankId) => {
  try {
    const res = await Axios.get(`/costmgmt/BankAccount/GETBankBranchDDl?BankId=${bankId}&CountryId=18`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getBankAccountByBranchDDL = async (bankId, accId, unitId, setter) => {
  try {
    const res = await Axios.get(`/fino/FinanceCommonDDL/BankAccountNumberByBankIdDDL?AccountId=${accId}&BusinessUnitId=${unitId}&BankId=${bankId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};



export const getBankStatementLanding = async (
  bankAccountId,
  businessUnitId,
  fromDate,
  toDate,
  setter,
  pageSize,
  pageNo,
  setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.get(`/fino/BusinessTransaction/GetBankAccountStatementByBankAccount?BankAccountId=${bankAccountId}&BusinessUnitId=${businessUnitId}&fromDate=${_dateFormatter(fromDate)}&toDate=${_dateFormatter(toDate)}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`);
    if (res.status === 200 && res?.data) {
      const data = res?.data?.data?.map(item => {
        return ({
          ...item,
          // drAmount:item.debitAmount >= 0 ? item.debitAmount : "",
          // drAmountInit:item.monAmount >= 0 ? item.monAmount : "",
          // crAmount:item.creditAmount < 0 ? item.creditAmount : "",
          // crAmountInit:item.monAmount < 0 ? item.monAmount : "",
          drAmount: item.debitAmount || "",
          crAmount: item.creditAmount || "",
          editable: false,
        })
      })
      setter({ ...res?.data, data });
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

// https://localhost:44346/fino/BusinessTransaction/UpdateBankAmountAndClosing
export const updateBankStatement = async (data, cf) => {
  try {
    const res = await Axios.put(`/fino/BusinessTransaction/UpdateBankAmountAndClosing`, data);
    if (res.status === 200 && res?.data) {
      cf();
      toast.success("Update successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};


export const reconcileCancelAction = async (
  accId,
  buId,
  bankAccId,
  statementId,
  journalId,
  cb,
  values
) => {
  try {
    const res = await Axios.post(
      `/fino/BusinessTransaction/CancelReconcile?AccountId=${accId}&UnitId=${buId}&BankAccId=${bankAccId}&StatementId=${statementId}&JournalId=${journalId}`
    );
    cb(values);
    toast.success(res?.data?.message || "Cancel successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};


export const checkTwoFactorApproval = async (
  otpType,
  unitId,
  transectionType,
  transectionId,
  transactionCode,
  journalTypeId,
  actionById,
  strOTP,
  cancelType,
  setDisabledModalButton,
  cb
) => {
  try {
    setDisabledModalButton(true);
    const res = await Axios.get(
      `/fino/CommonFino/CheckTwoFactorApproval?OtpType=${otpType}&intUnitId=${unitId}&strTransectionType=${transectionType}&intTransectionId=${transectionId}&strCode=${transactionCode}&journalTypeId=${journalTypeId}&intActionById=${actionById}&strOTP=${strOTP}&CancelType=${cancelType}`
    );
    // setFieldValue("instrumentNo",res?.data?.code)
    if (res?.data?.status === 1) {
      toast.success(res?.data?.message);
      cb(res?.data?.status);
    } else {
      toast.error(res?.data?.message);
      cb();
    }
    setDisabledModalButton(false);
    // toast.success("Submitted successfully");
  } catch (error) {
    setDisabledModalButton(false);
    cb(500);
    toast.warn(error?.response?.data?.message || "Please try again");
    // setDisabled(false);
  }
};