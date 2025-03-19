import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/SalesOffice/CreateSalesOffice`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/SalesOffice/EditSalesOffice`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize,search) {
  const searchPath = search ? `searchTerm=${search}&` : "";
  return axios.get(
    `/oms/SalesOffice/GetSalesOfficeSearchPagination?${searchPath}AccountId=${accId}&BUnitId=${buId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(`/oms/SalesOffice/GetSalesOfficeById?salesOfficeId=${id}`);
}
