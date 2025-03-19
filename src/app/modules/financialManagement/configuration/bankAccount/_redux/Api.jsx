import axios from "axios";

//Call bank ddl APi
export function getBankDDL() {
  return axios.get(`/costmgmt/BankAccount/GETBankDDl`);
}

//Call bankAccountType ddl APi
export function getBankAccountTypeDDL() {
  return axios.get(`/costmgmt/BankAccount/GETBankACTypeDDl`);
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/costmgmt/BankAccount/CreateBankAccount`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/costmgmt/BankAccount/EditBankAccount`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/costmgmt/BankAccount/GetBankAccountPasignationDTO?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(`/costmgmt/BankAccount/GetBankACById?BankACId=${id}`);
}

//Call get view modal data
export function getViewModalData(id) {
  return axios.get(`/costmgmt/BankAccount/GetBankACById?BankACId=${id}`);
}
