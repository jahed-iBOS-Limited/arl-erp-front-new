import axios from "axios";

//Call AccountGroupDDL APi
export function getAccountGroupDDL() {
  return axios.get(`/costmgmt/GeneralLedger/GetAccountGroupDDL`);
}

//Call AccountClassDDL APi
export function getAccountClassDDL(accId) {
  return axios.get(
    `/costmgmt/GeneralLedger/GetAccountClassDDL?AccountId=${accId}`
  );
}

//Call AccountCategoryDDL APi
export function getAccountCategoryDDL(accId) {
  return axios.get(
    `/costmgmt/GeneralLedger/GetAccountCategoryDDL?AccountId=${accId}`
  );
}

//Call accountTypeDDL APi
export function getAccountTypeDDL() {
  return axios.get(`/costmgmt/GeneralLedger/GetAccountTypeDDL`);
}

// Save create data
export function saveCreateData(data) {
  console.log(data);
  return axios.post(`/costmgmt/GeneralLedger/CreateGeneralLedger`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/costmgmt/GeneralLedger/EditGeneralLedger`, data);
}

// Save Extended data
export function saveExtendData(data) {
  return axios.post(
    `/costmgmt/GeneralLedger/CreateBusinessUnitGeneralLedger`,
    data
  );
}

//Call  get grid data api
export function getGridData(accId, buId, pageNo, pageSize, search) {
  const searchPath = search ? `searchTerm=${search}&` : "";

  return axios.get(
    `/costmgmt/GeneralLedger/GetGeneralLedgerSearchPasignation?${searchPath}accountId=${accId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
  );
}

//Call apii for get signle one
export function getDataById(id) {
  return axios.get(`/costmgmt/GeneralLedger/GetGeneralLedgerById?GLID=${id}`);
}

//Call BusDDL APi
export function getBuDDL(accId) {
  return axios.get(`/vat/TaxDDL/GetBusinessUnitByAccIdDDL?AccountId=${accId}`);
}

//Call apii for get signle one
export function getExtendDataById(id) {
  return axios.get(
    `/costmgmt/GeneralLedger/GetBusinessUnitGeneralLedgerByID?GLID=${id}`
  );
}

//Call getAccountClassPagination
export function getAccountClassPagination(accId) {
  return axios.get(
    `/costmgmt/GeneralLedger/GetAccountClassPagination?accountId=${accId}&pageNo=1&pageSize=100000&viewOrder=desc`
  );
}

//Call getAccountCategoryPasignation
export function getAccountCategoryPasignation(accId) {
  return axios.get(
    `/costmgmt/GeneralLedger/GetAccountCategoryPasignation?accountId=${accId}&pageNo=1&pageSize=1000&viewOrder=desc`
  );
}

//Call GetGeneralLedgerPasignation
export function getGeneralLedgerPasignation(accId) {
  return axios.get(
    `/costmgmt/GeneralLedger/GetGeneralLedgerPasignation?accountId=${accId}&pageNo=1&pageSize=1000&viewOrder=desc`
  );
}
