import axios from "axios";

//Call Empddl APi
export function GetSBUListDDL(accId, buId) {
  return axios.get(
    `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/DistributionChannel/CreateDistributionChannel`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/DistributionChannel/EditDistributionChannel`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize, search) {
  const searchPath = search ? `searchTerm=${search}&` : "";
  return axios.get(
    `/oms/DistributionChannel/GetDistributionChannelByAIdBIdSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/oms/DistributionChannel/GetDistributionChannelById?DistributionChannelId=${id}`
  );
}
