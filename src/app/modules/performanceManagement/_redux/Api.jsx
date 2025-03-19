import axios from "axios";

export function getReport(
  buId,
  reportTypeRefId,
  yearId,
  fromMonth,
  toMonth,
  isDashboard,
  reportType,
  sectionId = 0
) {

  return axios.get(
    `/pms/Kpi2/GetKpiReport?intUnitID=${buId}&ReportTypeReffId=${reportTypeRefId}&intYearId=${yearId}&intFromMonthId=${fromMonth}&intToMonthId=${toMonth}&isDashBoard=${isDashboard}&ReportType=${reportType}&SectionId=${sectionId}`
  );
}

//Call GetStrategicParticularsGrid APi
export function getStrategicParticularsGrid(
  accId,
  buId,
  yearId,
  yearRange,
  frequencyId,
  loopCount
) {
  return axios.get(
    `/pms/StrategicParticulars/GetStrategicParticularsGridView?YearId=${yearId}&YearRange=${yearRange}&accountId=${accId}&businessUnitId=${buId}&FrequencyId=${frequencyId}&loopCount=${loopCount}`
  );
}

// Employee basic info by id
export function getValuesAndCompByEmpId(employeeId, yearId) {
  return axios.get(
    `/pms/KPI/GetValuesAndCompetencyDataByEmployeeId?EmployeeId=${employeeId}&yearId=${yearId}`
  );
}

// individual kpi single data for edit
export function getKpiEditedSingleData(kpiId, type) {
  return axios.get(`/pms/KPI/GetKpiDetailsById?KpiId=${kpiId}&type=${type}`);
}

//Call Empddl APi
export function getEmpDDL(accId, buId) {
  return axios.get(
    `/pms/CommonDDL/EmployeeNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

export function getDataSourceDDL(accId, buId) {
  return axios.get(
    `/pms/CommonDDL/DataSourceDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call getEmployeeBasicInfoById APi
export function getEmployeeBasicInfoById(empId) {
  return axios.get(`/pms/KPI/GetEmployeeBasicInfoById?EmployeeId=${empId}`);
}
//Call Empddl APi
export function getEmpSupDDL(accId, buId, supervisorId) {
  return axios.get(
    `/pms/CommonDDL/EmployeeNameBySupervisorDDL?AccountId=${accId}&BusinessUnitId=${buId}&SupervisorId=${supervisorId}}`
  );
}

//Call yearDDL APi
export function getYearDDL(accId, buId) {
  return axios.get(
    `/pms/CommonDDL/YearDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call yearDDL APi
export function getCompetencyList(accId, buId, employeeId) {
  return axios.get(
    `/pms/KPI/CompetencyList?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}`
  );
}

// Get objectiveDDL
export function getObjectiveDDL(accId, buId, typeId, objType, yearId = 0) {
  return axios.get(
    `/pms/CommonDDL/ObjectiveDDL?AccountId=${accId}&BusinessUnitId=${buId}&StrategicParticularsTypeId=${typeId ||
      1}&emp_dept_sbu_Type=${objType}&yearId=${yearId}`
  );
}
// unFavourite ddl for dep or sbu
export function getUnFavDepSbuDDL(buId, type, year) {
  return axios.get(
    `/pms/CommonDDL/UnfavouriteDeptSbuDDL?UnitId=${buId}&Dept_SbuType=${type}&YearId=${year}`
  );
}

// Get WeightDDL
export function getWeightDDL(accId, buId, typeId) {
  return axios.get(
    `/pms/CommonDDL/WeightDDL?AccountId=${accId}&BusinessUnitId=${buId}&PMSDimensionTypeId=${typeId || 1}`
  );
}

// Get ScaleForValueDDL
export function getScaleForValueDDL(accId, buId, typeId) {
  return axios.get(
    `/pms/CommonDDL/ScaleForValueDDL?AccountId=${accId}&BusinessUnitId=${buId}&DimensionTypeId=${typeId}`
  );
}

// get BSCPerspectiveDDL
export function getBSCPerspectiveDDL() {
  return axios.get(`/pms/CommonDDL/BSCPerspectiveDDL`);
}

// Save values and competencyData
export function saveCreateData(data) {
  return axios.post(`/pms/KPI/CreateTergetKPI`, data);
}

export function saveCreateCopyData(
  copyFromEmpId,
  copyToEmpId,
  copyFromYearId,
  copyToYearId
) {
  return axios.post(
    `/pms/KPI/CreateCopyTargetKPI?CopyFromEmployeeId=${copyFromEmpId}&CopyToEmployeeId=${copyToEmpId}&copyFromYearId=${copyFromYearId}&copyToYearId=${copyToYearId}`
  );
}
export const saveValuesAndCompetency = (data) => {
  return axios.post(`/pms/KPI/CreateValuesAndCompetency`, data);
};

export const saveEditedIndividualKpiTarget = (data) => {
  return axios.post(`/pms/KPI/EditTergetKPI`, data);
};

// Save Edit data
export function saveEditData(data) {
  return axios.post(`/pms/KPI/UpdateValuesAndCompetency`, data);
}

//Call get grid data api
export function getGridData(accId, buId, typeId) {
  return axios.get(
    `/pms/KPI/GetKpiLanding?AccountId=${accId}&BusinessUnit=${buId}&Emp_Dept_SbuType=${typeId}&Status=true&PageNo=1&PageSize=1000&viewOrder=desc`
  );
}

//values pop up data
export function getValuesPopUp(id) {
  return axios.get(`/pms/KPI/ValueDetailsPopUp?CoreValueId=${id}`);
}

//competency pop up data
export function getCompetencyPopUp(id) {
  return axios.get(`/pms/KPI/CompetencyDetailsPopUp?competencyId=${id}`);
}

//Call single data api
export function getDataById(id, type) {
  return axios.get(`/pms/KPI/GetPmsKpiDetailsById?PmsId=${id}&type=${type}`);
}

export function getMeasuringScale(accId, buId) {
  return axios.get(
    `/pms/KPI/MeasuringScaleValue?DimensionTypeId=2&AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
export function getMeasuringScaleButtom(accId, buId) {
  return axios.get(
    `/pms/KPI/MeasuringScaleValue?DimensionTypeId=3&AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

export function getValueList(accId, buId) {
  return axios.get(
    `/pms/KPI/ValueList?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

export function deleteIndividualKPIById(id) {
  return axios.put(`/pms/KPI/UpdateIsActiveFalseByKPIId?KpiId=${id}`);
}

export function getNewKpiReport(
  buId,
  reportTypeRefId,
  yearId,
  fromMonth,
  toMonth,
  isDashboard,
  reportType
) {
  return axios.get(
    `/pms/Kpi2/GetNewKpiReport?intUnitID=${buId}&ReportTypeReffId=${reportTypeRefId}&intYearId=${yearId}&intFromMonthId=${fromMonth}&intToMonthId=${toMonth}&isDashBoard=${isDashboard}&ReportType=${reportType}`
  );
}
