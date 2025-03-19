import axios from "axios";

//Call sbu ddl APi
export function getSbuDDL(accId, buId) {
  return axios.get(
    `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
  );
}

//Call General Ledger ddl APi
export function getGlDDL(accId, buId) {
  return axios.get(
    `/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${buId}&AccountingGroupId=9`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/fino/AdjustmentJournal/CreateAdjustmentJournalNew`, data);
}

// Save created data
export function saveCompleteData(data) {
  return axios.post(`/fino/JournalPosting/CreateJournalPosting`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/fino/AdjustmentJournal/EditAdjustmentJournal`, data);
}

// Save Cancel data
export function saveCancelData(data) {
  return axios.put(`/fino/CommonFino/CancelJournalStatus`, data);
}

export function getGridData(
  buId,
  sbuId,
  accJournalTypeId,
  isPosted,
  isActive,
  fromdate,
  todate,
  pageNo,
  pageSize
) {
  let newPageNo = pageNo === 0 ? 1 : pageNo
  return axios.get(
    `/fino/BankJournal/JournalLanding?BusinessUnitId=${buId}&SbuId=${sbuId}&AccountingJournalTypeId=${accJournalTypeId}&IsPosted=${isPosted}&IsActive=${isActive}&fromdate=${fromdate}&Todate=${todate}&PageNo=${newPageNo}&PageSize=${pageSize}`
  );
}

//Call get grid data api
export function getGridDatabyCode(buId, sbuId, voucherCode,accJournalTypeId) {
  return axios.get(
    `/fino/BankJournal/JournalLanding?BusinessUnitId=${buId}&SbuId=${sbuId}&VoucherCode=${voucherCode}&PageNo=1&PageSize=100&AccountingJournalTypeId=7`
  );
}
