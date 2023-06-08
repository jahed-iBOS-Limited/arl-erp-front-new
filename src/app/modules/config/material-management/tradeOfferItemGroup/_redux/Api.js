import axios from "axios";

//save bill of material create data
export function saveCreateData(data) {
  return axios.post(
    `/item/TradeOfferItemGroup/CreateTradeOfferItemGroupHeader`,
    data
  );
}

//save bill of material edited data
export function saveEditedData(data) {
  console.log(data);
  return axios.put(
    `/item/TradeOfferItemGroup/EditTradeOfferItemGroupHeader`,
    data
  );
}

//Call bom get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/item/TradeOfferItemGroup/GetTradeOfferItemGroupPasignation?AccountId=${accId}&BUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call single data api
export function getDataById(itemGroupId) {
  return axios.get(
    `/item/TradeOfferItemGroup/GetItemGropById?TradeOfferItemGroupId=${itemGroupId}`
  );
}
