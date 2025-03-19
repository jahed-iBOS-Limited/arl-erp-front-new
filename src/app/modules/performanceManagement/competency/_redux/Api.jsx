import axios from "axios";

//Call Empddl APi
export function getEmpDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(
    `/pms/AssignFunctionalCompetency/CreateCompetencyData`,
    data
  );
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(
    `/pms/AssignFunctionalCompetency/EditCompetencyData`,
    data
  );
}

//Call get grid data api
export function getGridData(accId, buId) {
  return axios.get(
    `/pms/AssignFunctionalCompetency/CompetencyLandingPasignationByAcidUid?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=1&PageSize=100`
  );
}

//Call get grid data api
export function getEmployeeClusterList() {
  return axios.get(
    `/pms/PmsDimension/GetEmployeeClusterList`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/pms/AssignFunctionalCompetency/GetCompetencydetailsById?CompetencyId=${id}`
  );
}
