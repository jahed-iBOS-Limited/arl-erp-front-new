import axios from "axios";

//Call get grid data api
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
    `/fino/BankJournal/GetBankJournalLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&AccountingJournalTypeId=${accJournalTypeId}&IsPosted=${isPosted}&IsActive=${isActive}&fromdate=${fromdate}&Todate=${todate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call get grid data api
export function getGridDatabyCode(accId, buId, sbuId, voucherCode) {
  return axios.get(
    `/fino/BankJournal/GetBankJournalLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&VoucherCode=${voucherCode}&viewOrder=desc&PageNo=1&PageSize=100`
  );
}

export function saveCreateData(data) {
  return axios.post(`/fino/CashJournal/CreateCashJournalNew`, data);
}

// Save Edit data
export function saveEditData(data) {
  // save and edit API is same
  return axios.post(`/fino/BankJournal/CreateBankJournalNew`, data);
}

// Save complete
export function saveCompleted(data) {
  return axios.post(`/fino/JournalPosting/CreateJournalPosting`, data);
}
// Save Edit data
export function saveCancel(data) {
  return axios.put(`/fino/CommonFino/CancelJournalStatus`, data);
}
