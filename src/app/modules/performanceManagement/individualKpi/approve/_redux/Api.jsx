import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.put(`/pms/KPI/UpdatePMSIndividualKPIApprove`, data);
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

export function getEmpSupDDL(accId, buId) {
  return axios.get(
    `/pms/CommonDDL/EmployeeNameBySupervisorDDL?AccountId=${accId}&BusinessUnitId=${buId}&SupervisorId=1059`
  );
}

export function saveAproveKPI_api(data) {
  return axios.post(`/pms/Kpi2/ApproveKPI`, data);
}
export function saveRejectKPI_api(data) {
  return axios.post(`/pms/Kpi2/RejectKPI`, data);
}
