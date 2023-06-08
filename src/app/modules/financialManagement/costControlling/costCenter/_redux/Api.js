import axios from "axios";

//Call Empddl APi
export function getEmpDDL(accId, buId) {
  return axios.get(`/hcm/HCMDDL/GetLineManagerDDL?accountId=${accId}`);
}

// Save ControllingUnit
export function saveCreateData(data) {
  return axios.post(`/costmgmt/CostCenter/CreateCostCenterInformation`, data);
}

// Save Edit ControllingUnit
export function saveEditData(data) {
  return axios.put(`/costmgmt/CostCenter/EditCostCenterInformation`, data);
}

//Call ControllingUnit get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/costmgmt/CostCenter/GetCostCenterLandingPaging?accountId=${accId}&businessUnitId=${buId}&status=true&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single controlling unit by id
export function getDataById(id, accId, buId) {
  return axios.get(
    `/costmgmt/CostCenter/GetCostCenterInformationByCostCenter?AccountId=${accId}&BusinessUnitId=${buId}&CostCenterId=${id}`
  );
}

//Call Cost Center Type API
export function getCostCenterTypeDDLData(accId, buId, cuId) {
  return axios.get(
    `/costmgmt/CostCenterType/GetCostCenterTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&ControllingUnitId=${cuId}`
  );
}
//Call Cost Center Group Name API
export function getCostCenterGroupDDLApiData(accId, buId, cuId) {
  return axios.get(
    `/costmgmt/CostCenterGroup/GetCostCenterHierarchyDDL?AccountId=${accId}&BusinessUnitId=${buId}&ControllingUnitId=${cuId}`
  );
}
//Call Cost Center Group Name API
export function getProfitCenterDDLApiData(accId, buId, cuId) {
  return axios.get(
    `/costmgmt/ProfitCenter/GetProfitcenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&ControllingUnit=${cuId} `
  );
}
