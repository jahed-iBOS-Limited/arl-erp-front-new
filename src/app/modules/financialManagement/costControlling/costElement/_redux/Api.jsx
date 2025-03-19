import axios from "axios";

//Call general ledger ddl
export function getGeneralLedgerDDL(accId, buId) {
  return axios.get(
    `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountGroupId=12`
  );
}

//saveCostElementData
export function saveCreateData(data) {
  return axios.post(`/costmgmt/CostElement/CreateCostElement`, data);
}

//Call cost center get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/costmgmt/CostElement/GetCostElementLandingPaging?AccountId=${accId}&BusinessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single cost element by id
export function getDataById(id) {
  return axios.get(
    `/costmgmt/CostElement/GetCostElementView?CostElementId=${id}`
  );
}

// Save Edit Cost element
export function saveEditData(data) {
  return axios.post(
    `/costmgmt/CostElement/EditCostElementInformation
    `,
    data
  );
}
