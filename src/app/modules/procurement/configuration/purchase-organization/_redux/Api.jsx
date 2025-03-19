import axios from "axios";

// // Save PurchaseOrgData
export function saveCreateData(data) {
  return axios.post(
    `/procurement/PurchaseOrganization/CreatePurchaseOrganization`,
    data
  );
}

// // // Save Edit PurchaseOrganization
export function saveEditData(data) {
  return axios.post(
    `/procurement/PurchaseOrganization/ConfigPurchaseOrganization`,
    data
  );
}

//Call PurchaseOrgData get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/procurement/PurchaseOrganization/GetPurchaseOrganizationPasignation?AccountId=${accId}&status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call single PurchaseOrganization unit by id
export function getDataById(id) {
  return axios.get(
    `/procurement/PurchaseOrganization/GetPurchaseOrganizationViewDataByPOId?POId=${id}`
  );
}
