import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/item/TradeOfferSetup/CreateTradeOfferSetupCommon`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/item/TradeOfferSetup/GetTradeOfferSetupPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//getConditionTypeDDL
export function getConditionTypeDDL() {
  return axios.get(
    `/item/TradeOfferConditionType/GetTradeOfferConditionTypeDDL`
  );
}

//rounding type ddl
export function getRoundingTypeDDL() {
  return axios.get(`/item/PriceComponent/GetRoundingTypeDDL`);
}

// item list ddl
function getItemListDDL(accId, buId) {
  return axios.get(
    `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}
// item group ddl
function getItemGroupDDL(accId, buId) {
  return axios.get(
    `/item/TradeOfferItemGroup/GetItemGropFromGroupDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}

// partner group sales organization ddl
function getPartnerGroupSalesDDL(accId, buId) {
  return axios.get(
    `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// partner group distribution
function getPartnerGroupDistributionDDL(accId, buId) {
  return axios.get(
    `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}

// partner group sales territory
function getSalesTerritoryDDL(accId, buId) {
  return axios.get(
    `/oms/TerritoryInfo/GetTerritoryList?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// partner group partener ddl
function getPartnerDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

// all six ddl call once with promise all
export function getAllDDL(accId, buId) {
  return Promise.all([
    getItemListDDL(accId, buId),
    getItemGroupDDL(accId, buId),
    getPartnerGroupSalesDDL(accId, buId),
    getPartnerGroupDistributionDDL(accId, buId),
    getSalesTerritoryDDL(accId, buId),
    getPartnerDDL(accId, buId),
  ]);
}
