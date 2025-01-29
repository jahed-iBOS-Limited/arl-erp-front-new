import axios from "axios";

// save created cost control type data
export function saveCreateData(data) {
  return axios.post(`/costmgmt/CostCenterType/CreateCostCenterType`, data);
}

// get grid data for cost control type
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/costmgmt/CostCenterType/GetCostCenterTypeInformationPasignation?AccountId=${accId}&BusinessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single controlling unit by id
export function getDataById(id) {
  return axios.get(
    `/costmgmt/CostCenterType/GetCostCenterTypeInformationByTypeId?CostCenterTypeId=${id}`
  );
}

// Save Edit Cost center
export function saveEditData(data) {
  return axios.put(`/costmgmt/CostCenterType/EditCostCenterType`, data);
}
