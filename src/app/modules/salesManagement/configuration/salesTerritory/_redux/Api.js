import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/TerritoryInfo/CreateTerritoryInfo`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/TerritoryInfo/EditTerritoryInfo`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize,search) {
  const searchPath = search ? `searchTerm=${search}&` : "";
  return axios.get(
    `oms/TerritoryInfo/GetTerritorySearchLandingPagination?${searchPath}AccountId=${accId}&BUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
  );
}

//Call get view modal data
export function getViewModalData(territoryId) {
  return axios.get(
    `/oms/TerritoryInfo/GetTerritoryById?TerritoryId=${territoryId}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(`/oms/TerritoryInfo/GetTerritoryById?TerritoryId=${id}`);
}

//Call territory type ddl
export function getTerritoryTypeDDL(accId, buId) {
  return axios.get(
    `/oms/TerritoryTypeInfo/GetTerritoryTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call parent territory ddl
export function getParentTerritoryDDL(accId, buId) {
  return axios.get(
    `/oms/TerritoryInfo/GetTerritoryByParentTerritoryId?AccountId=${accId}&BUnitId=${buId}`
  );
}

//Call country ddl
export function getCountryDDL() {
  return axios.get(`/oms/TerritoryInfo/GetCountryDDL`);
}

//Call division ddl
export function getDivisionDDL(countryId) {
  return axios.get(`/oms/TerritoryInfo/GetDivisionDDL?countryId=${countryId}`);
}

//Call district ddl
export function getDistrictDDL(countryId, divisionId) {
  console.log(countryId, divisionId);
  return axios.get(
    `/oms/TerritoryInfo/GetDistrictDDL?countryId=${countryId}&divisionId=${divisionId}`
  );
}

//Call thana ddl
export function getThanaDDL(countryId, divisionId, districtId) {
  return axios.get(
    `/oms/TerritoryInfo/GetThanaDDL?countryId=${countryId}&divisionId=${divisionId}&districtId=${districtId}`
  );
}
