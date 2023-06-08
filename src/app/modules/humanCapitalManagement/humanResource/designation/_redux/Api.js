import axios from "axios";


// Save ControllingUnit 
export function saveCreateData(data) {
    return axios.post(`/domain/EmployeeBasicInformation/CreateEmployeeDesignation`, data);
};

// Save Edit ControllingUnit 
export function saveEditData(data) {
    return axios.put(`/domain/EmployeeBasicInformation/EditEmployeeDesignation`, data);
};

//Call ControllingUnit get grid data api
export function getGridData(accId, buId) {
    return axios.get(`/domain/EmployeeBasicInformation/GetEmployeeDesignationList?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=1&PageSize=50000`)
};

//Call single controlling unit by id
export function getDataById(accId,buId,id) {
    return axios.get(`/domain/EmployeeBasicInformation/GetEmployeeDesignationView?AccountId=${accId}&BusinessUnitId=${buId}&DesignationId=${id}`)
};