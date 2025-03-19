import axios from "axios";

//Call sbuDDL APi
export function getSbuDDL(accId, buId) {
  return axios.get(
    `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call salesOrganaizationDDL APi
export function getSalesOrganaizationDDL(accId, buId, sbuId) {
  return axios.get(
    `/oms/BusinessUnitSalesOrganization/GetBUSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}&SBUId=${sbuId}`
  );
}

//Call distributionChannelDDL APi
export function getDistributionChannelDDL(accId, buId) {
  return axios.get(
    `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}

//Call salesTerrioryDDL APi
export function getSalesTerrioryDDL(accId, buId, channelId) {
  // return axios.get(
  //   `/oms/TerritoryInfo/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  // );
  return axios.get(
    `/partner/BusinessPartnerSales/GetRTMTerritory?AccountId=${accId}&BusniessUnitId=${buId}&ChannelId=${channelId}`
  );
}

//Call transportZoneDDL APi
export function getTransportZoneDDL(accId, buId) {
  return axios.get(
    `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}&partnerFlag=true`
  );
}

//Call reconGeneralLedgerDDL APi
export function getGeneralLedgerDDL(accId, buId, accountGroupId) {
  return axios.get(
    `/domain/BusinessUnitGeneralLedger/GetBUGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountGroupId=${accountGroupId}`
  );
}

//Call soldToPartyDDL APi
export function getSoldToPartyDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetSoldToPartyForBPartSalesDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

//Call shippingPointDDL APi
export function getShippingPointDDL(accId, buId) {
  return axios.get(
    `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

//Call alternateShippingPointDDL APi
export function getAlternateShippingPointDDL(accId, buId) {
  return axios.get(
    `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

//Call priceStructureDDL APi
export function getPriceStructureDDL(accId, buId) {
  return axios.get(
    `/item/PriceStructure/GetBusiPartnerPriceStructureDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
