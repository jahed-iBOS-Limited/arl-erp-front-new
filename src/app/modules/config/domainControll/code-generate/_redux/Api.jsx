import axios from "axios";

//Call CodeGenerate ddl APi
export function getCodeTypeDDL() {
    return axios.get(`/domain/CodeGenerate/GetCodeGenerateDDL`);
};

// Save created data
export function saveCreateData(data) {
    return axios.post(`/domain/CodeGenerate/CreateCodeGenerate`, data);
};

// Save Edit data 
export function saveEditData(data) {
    return axios.put(`/domain/CodeGenerate/EditCodeGenerate`, data);
};

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
    return axios.get(`/domain/CodeGenerate/GetCodeGeneratePasignation?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`)
};

//Call single data api
export function getDataById(id) {
    return axios.get(`/domain/CodeGenerate/GetCodeGenerateById?CodeGenerateId=${id}`)
};