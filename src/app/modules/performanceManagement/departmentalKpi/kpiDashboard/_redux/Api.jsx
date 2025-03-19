import axios from "axios";

//Call Empddl APi
export function getUnFavouriteDDL(buId, empId, yearId ) {
  return axios.get(
    `/pms/CommonDDL/UnfavouriteDDL?UnitId=${buId}&EmployeeId=${empId}&YearId=${yearId}`
  );
}
export function updateUnpov(Kpiid) {
  return axios.put(
    `/pms/Kpi2/UpdateIsShownDashBoard?Kpiid=${Kpiid}&TF=true`
  );
}

export function getReport(
  buId,
  reportTypeRefId,
  yearId,
  fromMonth,
  toMonth,
  isDashboard,
  reportType
) {
  return axios.get(
    `/pms/Kpi2/GetKpiReport?intUnitID=${buId}&ReportTypeReffId=${reportTypeRefId}&intYearId=${yearId}&intFromMonthId=${fromMonth}&intToMonthId=${toMonth}&isDashBoard=${isDashboard}&ReportType=${reportType}`
  );
}