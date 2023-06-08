import axios from "axios";

//Call Empddl APi
export function getEmpDDL(accId, buId) {
  return axios.get(`/hcm/HCMDDL/GetLineManagerDDL?accountId=${accId}`);
}

//Call DDL Group Name APi
export function getGroupNameDDL(accId, buId, cuid) {
  return axios.get(
    `/costmgmt/ProfitCenterGorup/GetProfitCenterGroupDDL?AccountId=${accId}&BusinessUnitId=${buId}&ControllunitId=${cuid}`
  );
}

// Save ProfitCenter
export function saveCreateData(data) {
  return axios.post(`/costmgmt/ProfitCenter/CreateProfitCenter`, data);
}

// Save Edit ProfitCenter
export function saveEditData(data) {
  return axios.put(`/costmgmt/ProfitCenter/EditProfitCenter`, data);
}

//Call ProfitCenter get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/costmgmt/ProfitCenter/GetProfitCenterInformationPasignation?AccountId=${accId}&BusinessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single Profit Center by id
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ProfitCenter/GetProfitCenterInformationByProfitCenterId?ProfitcenterId=${id}`
  );
}
