import axios from "axios";

//Call GetTransportZoneDDL APi
export function getTZDDL(accId, buId) {
  return axios.get(
    `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/tms/TransportRoute/CreateTransportRoute`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.post(`/tms/TransportRoute/CreateRouteTransportZoneCommon`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/tms/TransportRoute/GetTransportRoutePasignation?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(`/tms/TransportRoute/GetTransportRouteById?RouteId=${id}`);
}
