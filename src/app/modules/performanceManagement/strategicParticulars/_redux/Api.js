import axios from "axios";

//Call Empddl APi
export function getDepartmentDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDepertmentDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

export function getStrObjList(strTypeId, strId) {
  return axios.get(
    `/pms/StrategicParticulars/StrategicparticularsObjectiveListofData?StrategicparticularTypeid=${strTypeId}&StrategicparticularId=${strId}`
  );
}

export function getStrTarget(year, strId) {
  return axios.get(
    `/pms/StrategicParticulars/GetStrategicParticularTargetAchivmentReport?FromYear=${year}&StrategicParticularsId=${strId}`
  );
}

//Call StrategicObjectiveTypeDDL APi
export function getStrategicObjectiveTypeDDL(accId, buId) {
  return axios.get(
    `/pms/CommonDDL/StrategicObjectiveTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call Empddl APi
export function getStrategicParticularsTypeDDL() {
  return axios.get(`/pms/CommonDDL/StrategicParticularsTypeDDL`);
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

// Save created data
export function saveCreateData(data) {
  return axios.post(
    `/pms/StrategicParticulars/CreateStrategicParticulars`,
    data
  );
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/pms/StrategicParticulars/EditStrategicParticulars`, data);
}

//Call get grid data api
export function getGridData(accId, buId, refId, type, categoryId, isActive, pageNo, pageSize, yearId = 0) {
  // dont change this condition unless you know the business properly
  let active = isActive !== null ? `&IsActive=${isActive}` : ""
  let category = categoryId ? `&CategoryId=${categoryId}` : ""
  return axios.get(
    `/pms/StrategicParticulars/GetStrategicParticularsPagination?accountId=${accId}&businessUnitId=${buId}&emp_dept_sbu_Type=${type}&ReffId=${refId}${active}${category}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&yearId=${yearId}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/pms/StrategicParticulars/GetGetStrategicParticularsById?SParticularsID=${id}`
  );
}
