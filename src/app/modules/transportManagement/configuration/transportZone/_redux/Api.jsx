import axios from "axios";
// Save created data
export function saveCreateData(data) {
  return axios.post(`/tms/TransportZone/CreateTransportZone`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/tms/TransportZone/EditTransportZone`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/tms/TransportZone/GetTransportZonePasignation?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/tms/TransportZone/GetTransportZoneById?TransportZoneId=${id}`
  );
}
