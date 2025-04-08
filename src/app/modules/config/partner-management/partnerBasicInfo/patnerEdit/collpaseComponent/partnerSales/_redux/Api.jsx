import axios from 'axios';

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
