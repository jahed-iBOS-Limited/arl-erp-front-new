import axios from "axios";

//Call GetGroupParentDDL APi
export function GetGroupParentDDL(accId, buId, cuId) {
  return axios.get(
    `/costmgmt/ProfitCenterGorup/GetProfitCenterGroupList?AccountId=${accId}&BusinessUnitId=${buId}&ControllunitId=${cuId}
    `
  );
}

// Save ControllingUnit
export function saveCreateData(data) {
  return axios.post(
    `/costmgmt/ProfitCenterGorup/CreateProfitCenterGroup`,
    data
  );
}

// Save Edit ControllingUnit
export function saveEditData(data) {
  return axios.put(`/costmgmt/ProfitCenterGorup/EditProfitCenterGroup`, data);
}

//Call ControllingUnit get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/costmgmt/ProfitCenterGorup/GetProfitCenterGroupInformationPasignation?accountId=${accId}&businessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single controlling unit by id
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ProfitCenterGorup/GetProfitCenterGroupByPCGroupId?ProfitCenterGroupId=${id}`
  );
}
