import Axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { toast } from "react-toastify";

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/Disbursement/GetSbuDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getAccDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
// /fino/BankBranch/GetBankJournal?BankAccountId=9&VoucherDate=2021-08-23&SBUId=19&IsPrint=true&Search=BP-APFIL-AUG21-96
export const getBankJournal = async (
  bankAccountId,
  fromDate,
  toDate,
  sbuId,
  isPrint,
  searchTerm,
  setter,
  sbu
) => {
  try {

    const res = await Axios.get(
      `/fino/BankBranch/GetBankJournal?BankAccountId=${bankAccountId}&FromDate=${_dateFormatter(
        fromDate
      )}&ToDate=${_dateFormatter(
        toDate
      )}&SBUId=${sbuId}&IsPrint=${isPrint}&Search=${searchTerm}`
    );
    // we need sbu with item, if user click edit, we will pass sbu from item to edit page, we can pass sbu directly from values?.sbu, but user can change sbu, then it will mismatch sbu with grid data set
    let newData = res?.data?.map(item => ({...item, sbu}))
    setter(newData);
  } catch (error) {}
};

export const setGenarateChequeNo = async (
  accId,
  buId,
  bankId,
  branchId,
  bankAccId,
  bankAccNo,
  instrumentId,
  setter,
  setChequeModal
) => {
  try {
    const res = await Axios.get(
      `/fino/BankJournal/ChequeGeneretor?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccId}&BankAccountNo=${bankAccNo}&instrumentId=${instrumentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.currentChequeNo);
      res?.data?.currentChequeNo ? setChequeModal(true) : setChequeModal(false);
    }
  } catch (error) {
    // toast.warn(error?.response?.data?.message, { toastId: "asfasfasErr" });
    setter([]);
  }
};

export const bankJournalPrintCount = async (data) => {
  try {
    const res = await Axios.put(`/fino/BankJournal/ChequePrintCount`, data);
    if (res.status === 200) {
    }
  } catch (error) {   
  }
};

export const checkTwoFactorApproval = async (
  otpType,
  unitId,
  transectionType,
  transectionId,
  journalCode,
  journalTypeId,
  actionById,
  strOTP,
  cancelType,
  setDisabledModalButton,
  cb
) => {
  try {
    setDisabledModalButton(true)
    const res = await Axios.get(
      `/fino/CommonFino/CheckTwoFactorApproval?OtpType=${otpType}&intUnitId=${unitId}&strTransectionType=${transectionType}&intTransectionId=${transectionId}&strCode=${journalCode}&journalTypeId=${journalTypeId}&intActionById=${actionById}&strOTP=${strOTP}&CancelType=${cancelType}`
    );
    // setFieldValue("instrumentNo",res?.data?.code)
    if (res?.data?.status === 1) {
      toast.success(res?.data?.message);
      cb(res?.data?.status);
    } else {
      toast.error(res?.data?.message);
      cb();
    }
    setDisabledModalButton(false)
    // toast.success("Submitted successfully");
  } catch (error) {
    setDisabledModalButton(false)
    // toast.warn(error?.response?.data?.message);
    // setDisabled(false);
  }
};

export const chequeGeneretor = async (
  accountId,
  businessUnitId,
  bankId,
  branchId,
  bankAccountId,
  bankAccountNo,
  instrumentId,
  bankJournalId,
  cb
) => {
  try {
    const res = await Axios.get(
      `fino/BankJournal/ChequeGeneretor?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccountId}&BankAccountNo=${bankAccountNo}&instrumentId=${instrumentId}&BankJournalId=${bankJournalId}`
    );
    if (res.status === 200 && res?.data) {
      cb(res?.data);
      // res?.data?.currentChequeNo ? setChequeModal(true) : setChequeModal(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: "asfasfasErr" });
    // setter([]);
  }
};
