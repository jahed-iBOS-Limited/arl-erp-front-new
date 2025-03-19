import axios from "axios";

export function saveCreateData(data) {
  return axios.post(`/fino/AdvanceExpense/CreateAdvanceExpense`, data);
}

export function getGridData(
  accId,
  buId,
  sbuId,
  cuId,
  empId,
  isApproved,
  pageNo,
  pageSize
) {
  return axios.get(
    `/fino/AdvanceExpense/GetAdvanceExpenseLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}&CurrencyId=${cuId}&EmployeeId=${empId}&isApproved=${isApproved}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

// SBU DDL
export function getSbuDDL(accId, buId) {
  return axios.get(
    `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
  );
}

export function saveEditData(data) {
  return axios.put(`/fino/AdvanceExpense/EditAdvanceExpense`, data);
}

export function saveCashReceiveData(data) {
  return axios.post(
    `/fino/AdvanceExpense/CreateRepaymentForAdvanceRequest`,
    data
  );
}
