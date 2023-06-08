import axios from "axios";

//Call GetGroupParentDDL APi
export function GetGroupParentDDL(accId, buId, cuId) {
  return axios.get(
    `/costmgmt/CostCenterGroup/GetCostCenterHierarchyList?AccountId=${accId}&BusinessUnitId=${buId}&ControllingUnitId=${cuId}`
  );
}

// Save ControllingUnit
export function saveCreateData(data) {
  return axios.post(`/costmgmt/CostCenterGroup/CreateCostCenterGroup`, data);
}

// Save Edit ControllingUnit
export function saveEditData(data) {
  return axios.put(
    `/costmgmt/CostCenterGroup/EditCostCenterGroup
    `,
    data
  );
}

//Call ControllingUnit get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/costmgmt/CostCenterGroup/GetCostCenterHierarchyLandingPaging?accountId=${accId}&businessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single controlling unit by id
export function getDataById(id) {
  return axios.get(
    `/costmgmt/CostCenterGroup/GetCostCenterHierarchyInformationByGroupId?CostCenterGroupId=${id}`
  );
}
