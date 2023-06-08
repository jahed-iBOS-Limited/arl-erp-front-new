import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/TerritoryTypeInfo/CreateTerritoryType`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/TerritoryTypeInfo/EditTerritoryTypeInfo`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/oms/TerritoryTypeInfo/GetTerritoryTypeLandingPagination?AccountId=${accId}&BUnitId=${buId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/oms/TerritoryTypeInfo/GetTerritoryTypeById?TerrTypeId=${id}`
  );
}
