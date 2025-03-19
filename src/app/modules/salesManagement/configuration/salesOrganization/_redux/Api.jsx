import axios from "axios";

// Save Sales Organization
export function saveCreateData(data) {
  return axios.post(`/oms/SalesOrganization/CreateSalesOrganization`, data);
}

// Save Edit Sales Organization
export function saveEditData(data) {
  return axios.post(
    `/oms/SalesOrganization/CreateBusinessUnitSalesOrganization`,
    data
  );
}

//Call Sales Organization get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/oms/SalesOrganization/GetSalesOrganizationByAIdPasignation?AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//business unit sales organization by id
export function getDataById(accId, id) {
  return axios.get(
    `/oms/SalesOrganization/GetBusinessUnitSalesOrganizationById?AccountId=${accId}&SOId=${id}`
  );
}
