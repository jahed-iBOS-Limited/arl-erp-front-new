import axios from "axios";


// Save created data
export function saveCreateData(data) {
    return axios.post(`/costmgmt/ControllingUnit/CreateControllingUnit`, data);
};

// Save Edit data 
export function saveEditData(data) {
    return axios.put(`/costmgmt/ControllingUnit/EditControllingUnit`, data);
};

//Call get grid data api
export function getGridData(accId, buId, shipPointId) {
    return axios.get(`/oms/PGI/GetPGIPasignation?AccountId=${accId}&BusinessUnitId=${buId}&ShippointId=${shipPointId}&viewOrder=desc&PageNo=1&PageSize=1000`)
};

//Call single data api
export function saveShipmentId(id,actionId) {
    return axios.post(`/wms/InventoryTransaction/CreateInvTransactionByShipmentID?ShipmentId=${id}&ActionBy=${actionId}`)
};
//Call getIsPGICheck data api
export function getIsPGICheck(accId, buId) {
    return axios.get(`/oms/PGI/GetIsPGICheck?AccountId=${accId}&BusinessUnitId=${buId}`)
};

