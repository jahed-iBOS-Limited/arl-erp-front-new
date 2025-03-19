import axios from "axios";

export function getScaleForDDL() {
  return axios.get(`/pms/CommonDDL/ScaleDDL`);
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/pms/MeasuringScale/CreateMeasuringScale`, data);
}

//Call get grid data api
export function getGridData(accId, buId) {
  return axios.get(
    `/pms/MeasuringScale/GetMeasuringScalePagination?accountId=${accId}&businessUnitId=${buId}&PageNo=1&PageSize=100&viewOrder=desc`
  );
}
