import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/pms/PmsDimension/CreatePmsDimension`, data);
}

//Call get grid data api
export function getGridData(accId) {
  return axios.get(
    `/pms/PmsDimension/GetPmsDimentionLanding?AccountId=${accId}&Status=true&viewOrder=desc&PageNo=1&PageSize=100`
  );
}

export function getDimensionType() {
  return axios.get(`/pms/PmsDimension/GetDimentionTypeList`);
}
