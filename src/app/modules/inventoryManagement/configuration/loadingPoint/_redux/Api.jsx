import axios from "axios";

//Call Designation APi
export function getDesignationDDLApi(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDesignationDDL?AccountId=1&BusinessUnitId=1`
  );
}

// Save ControllingUnit
export function saveCreateData(data) {
  return axios.post(`/oms/LoadingPoint/CreateLoadingPoint`, data);
}

// Save Edit ControllingUnit
export function saveEditData(data) {
  return axios.put(`/oms/LoadingPoint/EditLoadingPoint`, data);
}

//Call ControllingUnit get grid data api
export function getGridData(accId, buId, pageNo, pageSize,search) {
const searchPath = search ? `searchTerm=${search}&` : "";

  return axios.get(
    `/oms/LoadingPoint/GetLoadingPointLandingSearchPagination?${searchPath}AccountId=${accId}&BUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single controlling unit by id
export function getDataById(accId, buId, id) {
  return axios.get(`/oms/LoadingPoint/GetLoadingPointById?lpointID=${id}`);
}
