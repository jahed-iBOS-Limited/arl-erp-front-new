import axios from "axios";

export function getDepartmentDDLApi(accId, buId) {
    return axios.get(`/domain/EmployeeBasicInformation/GetEmployeeDepertmentDDL?AccountId=1&BusinessUnitId=1`);
};
//Call Designation APi
export function getDesignationDDLApi(accId, buId) {
    return axios.get(`/domain/EmployeeBasicInformation/GetEmployeeDesignationDDL?AccountId=1&BusinessUnitId=1`);
};


// Save ControllingUnit 
export function saveCreateData(data) {
    return axios.post(`/domain/EmployeeBasicInformation/CreateEmployeeDepartment`, data);
};

// Save Edit ControllingUnit 
export function saveEditData(data) {
    return axios.put(`/domain/EmployeeBasicInformation/EditEmployeeDepartment`, data);
};

//Call ControllingUnit get grid data api
export function getGridData(accId, buId) {
    return axios.get(`/domain/EmployeeBasicInformation/GetEmployeeDepertmentList?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=1&PageSize=500`)
};

//Call single controlling unit by id
export function getDataById(accId,buId,id) {
    return axios.get(`/domain/EmployeeBasicInformation/GetEmployeeDepertmentView?AccountId=${accId}&BusinessUnitId=${buId}&DepartmentId=${id}`)
};