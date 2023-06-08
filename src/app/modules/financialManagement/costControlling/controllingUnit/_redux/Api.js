import axios from "axios";

//Call Empddl APi
export function getEmpDDL(accId) {
  return axios.get(`/hcm/HCMDDL/GetLineManagerDDL?accountId=${accId}`);
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/costmgmt/ControllingUnit/CreateControllingUnit`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/costmgmt/ControllingUnit/EditControllingUnit`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitInformationPasignation?accountId=${accId}&businessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitByControllId?ControllingUnitId=${id}`
  );
}
