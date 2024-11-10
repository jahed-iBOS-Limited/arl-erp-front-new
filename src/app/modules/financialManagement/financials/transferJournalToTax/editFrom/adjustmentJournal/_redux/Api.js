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
  accId,
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
  return axios.get(
    `/fino/AdjustmentJournal/GetAdjustmentJournalLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&AccountingJournalTypeId=${accJournalTypeId}&IsPosted=${isPosted}&IsActive=${isActive}&fromdate=${fromdate}&Todate=${todate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call get grid data api
export function getGridDatabyCode(accId, buId, sbuId, voucherCode) {
  return axios.get(
    `/fino/AdjustmentJournal/GetAdjustmentJournalLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&VoucherCode=${voucherCode}&viewOrder=desc&PageNo=1&PageSize=212`
  );
}
