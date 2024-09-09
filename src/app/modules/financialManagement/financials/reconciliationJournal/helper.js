import axios from "axios";
// import { toast } from "react-toastify";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

export const getType = () => {
  return [
    { value: 1, label: "Inventory, Overhead and COGS" },
    { value: 2, label: "Depreciation" },
    { value: 3, label: "Income Tax Provision" },
    { value: 4, label: "Year Closing" },
    { value: 5, label: "Baddebet Interest Provision" },
    { value: 6, label: "Salary Journal" },
  ];
};

export const savebankStatement = async (
  accId,
  insertby,
  cb,
  setDisabled,
  setIsUpload
) => {
  setDisabled(true);

  try {
    const res = await axios.post(
      `/fino/BusinessTransaction/CreateBankAccountStatementSubmit?intAccountID=${accId}&intInsertBy=${insertby}`
    );
    if (res.status === 200) {
      cb();
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
      setIsUpload(false);
    }
  } catch (error) {
    setDisabled(false);
    setIsUpload(false);
  }
};

// https://localhost:44315/wms/WmsReport/GetInventoryJournalGenLedger?AccountId=2&BusinessUnitId=164&SbuId=68&fromDate=2021-08-01&toDate=2021-08-30&typeId=2&actionBy=0
export const getInventoryJournalGenLedger = async (
  accountId,
  businessUnitId,
  sbuId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);

  try {
    const api = `/wms/WmsReport/GetInventoryJournalGenLedger?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&SbuId=${sbuId}&fromDate=${_dateFormatter(
      fromDate
    )}&toDate=${_dateFormatter(toDate)}&typeId=2`;

    const res = await axios.get(api);
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

export const getYearClosing = async (
  userId,
  businessUnitId,
  typeId,
  closingDate,
  setClosingData,
  setLoading
) => {
  console.log("setLoading", setLoading);
  setLoading(true);
  try {
    const api = `/fino/Account/AccountClosingYearlyGetAndPosting?businessUnitId=${businessUnitId}&closingDate=${closingDate}&actionBy=${userId}&typeId=${typeId}`;
    const res = await axios.post(api);
    setClosingData(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const saveYearClosing = async (
  userId,
  businessUnitId,
  typeId,
  closingDate,
  setLoading
) => {
  setLoading(true);
  try {
    const api = `/fino/Account/AccountClosingYearlyGetAndPosting?businessUnitId=${businessUnitId}&closingDate=${closingDate}&actionBy=${userId}&typeId=${typeId}`;
    const res = await axios.post(api);
    setLoading(false);
    if (res?.status === 200) {
      toast.success(res?.data);
    } else {
      toast.warn(res?.data);
    }
  } catch (err) {
    setLoading(false);
  }
};
export const getInventoryJournal = async (
  accountId,
  businessUnitId,
  sbuId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const api = `/wms/WmsReport/GetInventoryJournal?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&SbuId=${sbuId}&fromDate=${_dateFormatter(
      fromDate
    )}&toDate=${_dateFormatter(toDate)}&typeId=1`;

    const res = await axios.get(api);
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

// Depricision
export const getDepreciationGenLedgerList = async (
  accountId,
  businessUnitId,
  sbuId,
  transactionDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const api = `/asset/DepreciationJournal/GetDepreciationGenLedgerList?accountId=${accountId}&businessUnitId=${businessUnitId}&sbuId=${sbuId}&dteDate=${_dateFormatter(
      transactionDate
    )}&typeId=2`;
    const res = await axios.get(api);
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

export const getDepreciationJournal = async (
  accountId,
  businessUnitId,
  sbuId,
  transactionDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const api = `/asset/DepreciationJournal/GetDepreciationJournal?accountId=${accountId}&businessUnitId=${businessUnitId}&sbuId=${sbuId}&dteDate=${_dateFormatter(
      transactionDate
    )}&typeId=1`;

    const res = await axios.get(api);
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

export const postInventoryJournal = async (
  closingTypeId,
  accountId,
  businessUnitId,
  sbuId,
  fromDate,
  toDate,
  userId,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const api = `/wms/WmsReport/PostInventoryJournal?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&SbuId=${sbuId}&fromDate=${_dateFormatter(
      fromDate
    )}&toDate=${_dateFormatter(
      toDate
    )}&typeId=3&actionBy=${userId}&closingTypeId=${closingTypeId}`;
    const res = await axios.post(api);
    setLoading(false);
    cb(res?.data?.message);
  } catch (err) {
    setLoading(false);
  }
};
export const postDepreciationJournal = async (
  accountId,
  businessUnitId,
  sbuId,
  transactionDate,
  userId,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const api = `/asset/DepreciationJournal/PostDepreciationJournal?accountId=${accountId}&businessUnitId=${businessUnitId}&sbuId=${sbuId}&dteDate=${_dateFormatter(
      transactionDate
    )}&typeId=3&actionBy=${userId}`;
    const res = await axios.post(api);
    setLoading(false);
    cb(res?.data?.message);
  } catch (err) {
    setLoading(false);
  }
};

export const postClosingYearJournal = async (
  accountId,
  businessUnitId,
  sbuId,
  closingDate,
  userId,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    // add post api here
    const api = ``;
    const res = await axios.post(api);
    setLoading(false);
    cb(res?.data?.message);
  } catch (err) {
    setLoading(false);
  }
};

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getReconcilationJournelData = async (
  businessUnitId,
  fromDate,
  toDate,
  intTypeId,
  isDayBased,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const api = `/fino/Report/GetInventoryJournalSubSection?intBusinessUnitId=${businessUnitId}&dteFromDate=${fromDate}&dteToDate=${toDate}&intType=${intTypeId}&isDayBased=${isDayBased}`;

    const res = await axios.get(api);
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

// get or create salary journal
export const getOrCreateSalaryJournal = async (obj) => {
  // argument destructure
  const { buId, accountId, values, setterFunction, setLoading, type } = obj;

  // generate year & month // 2024-03 > ['2024','03'] > [2024,03]
  const [year, month] = values?.monthYear?.split("-")?.map(Number);
  // console.log(year, month);

  const api = {
    get: "GetSalaryGenerateRequestLanding",
    create: "GetSalaryJVCostCenterWiseNew",
  };

// get last day of month - month - year from year & month
// 2024 04 > Full Date > ISO String Date > 2024-04-30
  let date = new Date(Date.UTC(year, month, 0))?.toISOString()?.split("T")[0];

  // console.log(date);
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/Report/${api[type]}?AccountId=${accountId}&BusinessUnitId=${buId}&MonthId=${month}&YearId=${year}&Date=${date}`
    );
    setterFunction(res?.data);
  } catch (e) {
    setterFunction([]);
    console.error(e);
  }

  setLoading(false);
};
