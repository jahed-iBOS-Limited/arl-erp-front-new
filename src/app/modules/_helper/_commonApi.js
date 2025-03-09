import axios from "axios";
import { toast } from "react-toastify";

export const getImageuploadStatus = (accountId) => {
  return axios.get(`/fino/Image/getImageuploadStatus?accountId=${accountId}`);
};


export const getSBU = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${BuId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};


export const getBankAc = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};


export const changeChequeBookSave = async (id, chequeNo, cb) => {
  try {
    const res = await axios.put(
      `/fino/BankJournal/UpdateChekNoById?Id=${id}&CheckNo=${chequeNo}`
    );
    if (res.status === 200 && res?.data) {
      cb();
      toast.success(res?.data?.message, { toastId: "sfasfsf" });
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: "sfasfsfErr" });
  }
};


export const genarateChequeNo = async (
  accId,
  buId,
  bankId,
  branchId,
  bankAccId,
  bankAccNo,
  instrumentId
) => {
  try {
    const res = await axios.get(
      `/fino/BankJournal/ChequeGeneretor?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccId}&BankAccountNo=${bankAccNo}&instrumentId=${instrumentId}`
    );
    if (res.status === 200 && res?.data) {
      return res?.data;
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: "asfasfasErr" });
    return [];
  }
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
    const res = await axios.get(
      `/fino/BankJournal/ChequeGeneretor?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccId}&BankAccountNo=${bankAccNo}&instrumentId=${instrumentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.currentChequeNo);
      res?.data?.currentChequeNo ? setChequeModal(true) : setChequeModal(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, { toastId: "asfasfasErr" });
    setter([]);
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
    const res = await axios.get(
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


export const getPartner = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
