import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.put(`/pms/Kpi2/EmployeeActualTargetUpdate`, data);
}

export function getObjective(accId, buId, empId, yearId) {
  return axios.get(
    `/pms/Kpi2/GetObjectiveForEmployee?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}&YearId=${yearId}`
  );
}

export function getTarget(kpiId, freqId, yearId) {
  return axios.get(
    `/pms/Kpi2/GetEmployeeTargetDetails?KpiId=${kpiId}&FreqId=${freqId}&YearId=${yearId}`
  );
}
