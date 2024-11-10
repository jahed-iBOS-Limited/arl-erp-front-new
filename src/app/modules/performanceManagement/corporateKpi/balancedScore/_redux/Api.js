import axios from "axios";

//Call Empddl APi
export function getEmpDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

export function getDepartmentDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDepertmentDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
export function getSbuDDL(accId, buId) {
  return axios.get(
    `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
  );
}
