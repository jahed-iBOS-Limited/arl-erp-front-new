import axios from "axios";

//Call Empddl APi
export function getEmpDDL(accId, buId) {
    return axios.get(`/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`);
};

// Save created data
export function saveCreateData(data) {
    return axios.post(`/costmgmt/ControllingUnit/CreateControllingUnit`, data);
};

// Save Edit data 
export function saveEditData(data) {
    return axios.put(`/costmgmt/ControllingUnit/EditControllingUnit`, data);
};

//Call get grid data api
export function getGridData(accId, buId) {
    return axios.get(`/costmgmt/ControllingUnit/GetControllingUnitInformationPasignation?accountId=${50}&businessUnitId=${50}&Status=true&PageNo=1&PageSize=1000&viewOrder=desc`)
};

//Call single data api
export function getDataById(id) {
    return axios.get(`/costmgmt/ControllingUnit/GetControllingUnitByControllId?ControllingUnitId=${id}`)
};