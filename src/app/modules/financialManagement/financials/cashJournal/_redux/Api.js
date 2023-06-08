import axios from "axios";

//Call get grid data api
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
    `/fino/BankJournal/JournalLanding?BusinessUnitId=${buId}&SbuId=${sbuId}&VoucherCode=${voucherCode}&PageNo=1&PageSize=100&AccountingJournalTypeId=${accJournalTypeId}`
  );
}

export function saveCreateData(data) {
  return axios.post(`/fino/CashJournal/CreateCashJournalNew`, data);
}

// Save complete
export function saveCompleted(data) {
  return axios.post(`/fino/JournalPosting/CreateJournalPosting`, data);
}
// Save Edit data
export function saveCancel(data) {
  return axios.put(`/fino/CommonFino/CancelJournalStatus`, data);
}
