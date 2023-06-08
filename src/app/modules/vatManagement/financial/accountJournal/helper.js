import Axios from "axios";
import { toast } from "react-toastify";
export const getAccountJournalLandingData = async ({ buId, sbuId, journalTypeId, fromDate, toDate, voucherCode, pageNo, pageSize, setter, setLoading }) => {
  setLoading(true);
  const VoucherCode = voucherCode ? `&VoucherCode=${voucherCode}` : "";
  try {
    const res = await Axios.get(
      `/fino/BankJournal/GetTaxAccountingJournalLanding?BusinessUnitId=${buId}&SbuId=${sbuId}&AccountingJournalTypeId=${journalTypeId}&fromdate=${fromDate}&Todate=${toDate}${VoucherCode}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};
// getNextBankCheque
export const getNextBankCheque = async (accId, buId, bankId, branchId, bankAccountId, setter, key) => {
  try {
    const res = await Axios.get(
      `/fino/BankJournal/GetNextBankCheque?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccountId}`
    );
    if (res.status === 200 && res?.data) {
      setter(key, res?.data?.currentChequeNo);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
  }
};
export const generateAdviceNo = async (UnitId, setFieldValue) => {
  try {
    const res = await Axios.post(`/fino/BankBranch/GenerateAdviceNo?UnitId=${UnitId}`);
    setFieldValue("instrumentNo", res?.data?.code);
  } catch (error) {
    // toast.warn(error?.response?.data?.message);
    // setDisabled(false);
  }
};

export const getPartnerTypeDDL = async (setter) => {
  try {
    const res = await Axios.get("/fino/AccountingConfig/GetAccTransectionTypeDDL");
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};
export const getBankAc = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(`/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${BuId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getInstrumentType = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSendToGLBank = async (accId, BuId, journalType, setter) => {
  try {
    const res = await Axios.get(`/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${BuId}&AccountingGroupId=${journalType}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
// GetJournalTypeDDL
export const getJournalTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/fino/SubLedger/GetAccountingJournalTypeDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

//GetSBUListDDL
export const cashJournalSbuApi = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(`/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveAccountingJournal = async ({
    payload,
    cb,
    setRowDto,
    setDisabled,
 }) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/fino/AccountingJournalTax/AccountingJournalTaxEntry`, payload);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Journal Created Successfully");
      cb && cb();
      setRowDto([]);
      setDisabled(false);
      // const obj = {
      //   title: "Bank Journal Code",
      //   message: res?.data?.code,
      //   noAlertFunc: () => {},
      // };
      // // IConfirmModal(obj);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const accountingJournalTaxEntry = async (payload, setter) => {
  try {
    const res = await Axios.post(`/fino/AccountingJournalTax/AccountingJournalTaxEntry`, payload);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const cancelAccountingJournalTax = async (payload, setDisabled, cb) => {
  try {
    const res = await Axios.put(`/fino/AccountingJournalTax/CancelAccountingJournalTax`, payload);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Journal Deleted Successfully");
      cb && cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
    setDisabled(false);
  }
};
