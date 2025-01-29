import axios from "axios";
//Call Empddl APi
export function getEmpDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
//Call getShippoint DDl APi
export function getShippointDDL(userId, clientId, buId) {
  return axios.get(
    `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${clientId}&BusinessUnitId=${buId}`
  );
}
// Save created data
export function saveCreateData(data) {
  return axios.post(`/costmgmt/ControllingUnit/CreateControllingUnit`, data);
}
// Save Edit data
export function saveEditData(data) {
  return axios.put(`/costmgmt/ControllingUnit/EditControllingUnit`, data);
}
//Call single data api
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitByControllId?ControllingUnitId=${id}`
  );
}
//Call get grid data api
export function getPendingOrderGridData(
  accId,
  buId,
  shipPointId,
  pageNo,
  pageSize
) {
  return axios.get(
    `/oms/SalesOrder/CustomerPendingDataLanding?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${shipPointId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}
