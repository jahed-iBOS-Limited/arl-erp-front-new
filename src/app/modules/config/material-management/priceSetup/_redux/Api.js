import axios from "axios";

export const callAllDDLApi = (accId, buId) => {
  return Promise.all([
    getConditionDDL(accId, buId),
    getSalesOrganizationDDL(accId, buId),
    getTerritoryDDL(accId, buId),
    getSoldToPartnerShipToPartnerDDL(accId, buId),
    getDistributionChannelDDL(accId, buId),
    getItemSalesDDL(accId, buId),
  ]);
};

//Call conditionddl APi
function getConditionDDL() {
  return axios.get(`/item/PriceSetup/GetPriceConditionTypeOrganizationDDL`);
}
//Call GetSalesOrganizationDDL APi
function getSalesOrganizationDDL(accId, buId) {
  return axios.get(
    `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
//Call GetTerritoryDDL APi
function getTerritoryDDL(accId, buId) {
  return axios.get(
    `/oms/TerritoryInfo/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call GetTerritoryDDL APi
function getSoldToPartnerShipToPartnerDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call GetDistributionChannelDDL APi
function getDistributionChannelDDL(accId, buId) {
  return axios.get(
    `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}

//Call GetItemSalesDDL APi
function getItemSalesDDL(accId, buId) {
  return axios.get(
    `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/item/PriceSetup/CreatePriceSetup`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/costmgmt/ControllingUnit/EditControllingUnit`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/item/PriceSetup/GetTradeOfferSetupPagination?accountId=${accId}&businessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitByControllId?ControllingUnitId=${id}`
  );
}
