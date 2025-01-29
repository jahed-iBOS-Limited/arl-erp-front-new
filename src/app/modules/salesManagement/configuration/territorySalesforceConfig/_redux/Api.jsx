import axios from "axios";

//Call erritoryTypeDDL APi
export function getTerritoryTypeDDL(accId, buId) {
  return axios.get(
    `/oms/TerritoryTypeInfo/GetTerritoryTypeList?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call getEmployeeDDL APi
export function getEmpDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
//Call erritoryTypeDDL APi
export function getTerritoryDDL(accId, buId, typeId) {
  return axios.get(
    `/oms/TerritoryInfo/GetTerritoryandType?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryTypeId=${typeId}`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/SalesForceTerritory/CreateSalesForceTerritory`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/SalesForceTerritory/EditSalesForceTerritory`, data);
}

//Call get grid data api
export function getGridData(accId, buId, data, pageNo, pageSize, search) {
  // const searchPath = search ? `searchTerm=${search}&` : "";
  return axios.get(
    // `/oms/SalesForceTerritory/GetSalesForceTerritorySearchPagination?${searchPath}AccountId=${accId}&BUnitId=${buId}&status=true&PageNo=1&PageSize=100&viewOrder=desc`
    // `/oms/SalesInformation/getSalesForceConfig?intpartid=1&intChannelid=${0}&intBusinessunitid=${buId}`

    `/oms/SalesInformation/getSalesForceConfig?intpartid=1&intChannelid=${data?.channelId | 0}&intBusinessunitid=${buId}&intSetupPKId=${data?.pkId || 0}&intLevelid=${data?.levelId || 0}&intEnroll=0&intRegionid=${data?.regionId || 0}&intAreaid=${data?.areaId || 0}&intterritoryid=${data?.territoryId || 0}&TerritoryTypeId=${data?.TerritoryTypeId || 0}&salesForceType=${data?.salesForceType || ""}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/oms/SalesForceTerritory/GetSalesForceTerritorybyId?SFTId=${id}`
  );
}

export const GetEmployeeLoginInfo_api = async (accId, buId, empId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
