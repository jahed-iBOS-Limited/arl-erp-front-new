import axios from "axios";

//Call VehicleTypeddl APi
export function getVehicleTypeDDL() {
  return axios.get(`/tms/Vehicle/GetVehicleTypeDDL`);
}
//
export function getVehicleCapacityDDL() {
  return axios.get(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
}
//getVehicleFuelTypeDDL
export function getVehicleFuelTypeDDL() {
  return axios.get("tms/Vehicle/GetVehicleFuelTypeDDL?IsActive=true");
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/tms/Vehicle/CreateVehicle`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/tms/Vehicle/EditVehicle`, data);
}

//Call get grid data api
export function getGridData(
  accId,
  pageNo,
  pageSize,
  buId,
  search,
  shipPointId,
  ownerTypeId
) {
  const searchPath = search ? `searchTerm=${search}&` : "";

  return axios.get(
    `/tms/Vehicle/VehicleInfosearchPasignation?${searchPath}VehicleNo=1&Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&OwnerTypeId=${ownerTypeId}&ShipPointId=${shipPointId}`
  );
}
export function GetTransportModeDDLApi() {
  return axios.get(`/oms/Shipment/GetTransportModeDDL`);
}
//Call single data api
export function getDataById(id) {
  return axios.get(`/tms/Vehicle/GetVehicleById?VehicleId=${id}`);
}

//call employee List DDL
export function getEmployeeListDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//call vehicle Use Purpose List DDL
export function getVehicleUsePurposeDDL() {
  return axios.get(`/tms/Vehicle/GetVehiclePurposeTypeDDL`);
}
