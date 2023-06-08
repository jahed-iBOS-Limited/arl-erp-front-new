import axios from "axios";
import { toast } from "react-toastify";

export const getJournalTypeDDL = async (setter) => {
  try {
    const res = await axios.get(`/fino/SubLedger/GetAccountingJournalTypeDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getCashJournalGridData = async (
  accId,
  buId,
  sbuId,
  accJournalTypeId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading,
  setTotalCount,
  journalCode=""
) => {
  setLoading(true);
  let JournalCode = journalCode ? `&JournalCode=${journalCode}` : "";
  try {
    const res = await axios.get(
      `/fino/TransferJournalToTaxAcc/GetCashJournalLandingPasignationTransf?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&AccountingJournalTypeId=${accJournalTypeId}&fromdate=${fromDate}&Todate=${toDate}${JournalCode}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data?.data);
    setTotalCount(res?.data?.totalCount);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getBankJournalGridData = async (
  accId,
  buId,
  sbuId,
  accJournalTypeId,
  isPosted,
  isActive,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading,
  setTotalCount,
  journalCode=""
) => {
  setLoading(true);
  let JournalCode = journalCode ? `&JournalCode=${journalCode}` : "";
  try {
    const res = await axios.get(
      `/fino/TransferJournalToTaxAcc/GetBankJournalLandingPasignationTransf?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&AccountingJournalTypeId=${accJournalTypeId}&IsPosted=${isPosted}&IsActive=${isActive}${JournalCode}&fromdate=${fromDate}&Todate=${toDate}&viewOrder=DESC&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data?.data);
    setTotalCount(res?.data?.totalCount);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getAdjustmentJournalGridData = async (
  accId,
  buId,
  sbuId,
  accJournalTypeId,
  isPosted,
  isActive,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading,
  setTotalCount,
  journalCode=""
) => {
  setLoading(true);
  let JournalCode = journalCode ? `&JournalCode=${journalCode}` : "";
  try {
    const res = await axios.get(
      `/fino/TransferJournalToTaxAcc/GetAdjustmentJournalLandingPasignationTransf?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&AccountingJournalTypeId=${accJournalTypeId}&IsPosted=${isPosted}&IsActive=${isActive}${JournalCode}&fromdate=${fromDate}&Todate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data?.data);
    setTotalCount(res?.data?.totalCount);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const transferJournal = async (
  
  buId,
  actionBy,
  data,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/fino/TransferJournalToTaxAcc/CreateTransferJournalToTaxAcc?BusinessUnitId=${buId}&ActionById=${actionBy}`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getBankJournalView = async (url ,setter,setLoading, text = null) => {
  try {
    setLoading(true)
    const res = await axios.get(
      url
    );
    if (res.status === 200 && res?.data) {
      setLoading(false)
      text === "adjustment" ? setter(res?.data[0]) : setter(res?.data)
    }
  } catch (error) {
    setLoading(false)
  }
};


export const commonTransferJournal = async (
  payload,
  cb
) => {
  try {
    const res = await axios.post(
      `/fino/AccountingJournalTax/AccountingJournalTaxEntry`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
