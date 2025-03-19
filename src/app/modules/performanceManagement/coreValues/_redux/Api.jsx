import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/pms/CoreValues/CreateCoreValues`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/pms/CoreValues/EditCoreValues`, data);
}

//Call get grid data api
export function getGridData(accId, buId) {
  return axios.get(
    `/pms/CoreValues/GetCoreValuesPagination?accountId=${accId}&businessUnitId=${buId}&PageNo=1&PageSize=100&viewOrder=desc`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(`/pms/CoreValues/GetCoreValuesById?CoreValues=${id}`);
}
