import axios from "axios";

//Call GetShipPointDDL APi
export function GetShipPointDDL(accId, buId) {
  return axios.get(
    `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

export function GetCategoryDDL() {
  return axios.get(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
}
//Call GetWarehouseDDL APi
export function GetWarehouseDDL(accId, buId, shipPointId) {
  return axios.get(
    `/wms/ShipPointWarehouse/GetShipPointWarehouseDDL?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${shipPointId}`
  );
}
//Call GetSoldToParty APi
// export function GetSoldToPartyDDL(accId, buId, shipPointId) {
//   return axios.get(
//     `/partner/BusinessPartnerBasicInfo/GetSoldToParty?accountId=${accId}&businessUnitId=${buId}&ShipPointId=${shipPointId}`
//   );
// }
export function GetSoldToPartyDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}
//Call GetShipToParty APi
export function GetShipToPartyDDL(accId, buId, soldToPartnerId, shipPointId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetShipToParty?AccountId=${accId}&BusinessUnitId=${buId}&SoldToPartnerId=${soldToPartnerId}&shippointid=${shipPointId}`
  );
}
//Call GetSalesOrderListDDL APi
export function GetSalesOrderListDDL(buId, soldToPartnerId, shipToPartyId) {
  return axios.get(
    `/oms/SalesOrder/GetSalesOrderListBySoldToPartyShipToPartyDDL?BusinessUnitId=${buId}&SoldToPartnerId=${soldToPartnerId}&ShipToParty=${shipToPartyId}`
  );
}
//Call GetDeliveryTypeDDL APi
export function GetDeliveryTypeDDL() {
  return axios.get(`/wms/Delivery/GetDeliveryTypeDDL`);
}
//Call GetDeliveryTypeDDL APi
export function GetItemPlantLocationDDL(whId, ItemId) {
  return axios.get(
    `/wms/ItemPlantWarehouse/GetItemPlantLocationDDL?whId=${whId}&ItemId=${ItemId}`
  );
}
//Call GetDataBySalesOrder APi
// export function GetDataBySalesOrder(salesOrderId, ShipToPId) {
//   return axios.get(
//     `/oms/SalesOrder/GetDataBySalesOrderId?SalesOrderId=${salesOrderId}&ShipToPartnerId=${ShipToPId}`
//   );
// }
export function GetDataBySalesOrder(salesOrderId, wearHouseId) {
  return axios.get(
    `/oms/SalesOrder/GetDataOfSalesOrderByIdandWhId?SalesOrderId=${salesOrderId}&WearHouseId=${wearHouseId}`
  );
}
// Save created data
export function saveCreateData(data) {
  return axios.post(`/wms/Delivery/CreateDelivery`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/wms/Delivery/EditDeliveryOrders`, data);
}

//Call get grid data api
export function getGridData(
  accId,
  buId,
  pageNo,
  pageSize,
  search,
  sbuId,
  shipPointId,
  channelId,
  status,
  fromDate,
  toDate
) {
  const searchPath = search ? `searchTerm=${search}&` : "";
  const isDate = fromDate ? `&fromDate=${fromDate}&toDate=${toDate}` : "";

  return axios.get(
    `/wms/Delivery/GetDeliverySearchPagination?${searchPath}&AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&sbuId=${sbuId}&shipPointId=${shipPointId}&distributionChannelId=${channelId}&status=${status}${isDate}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(`/wms/Delivery/GetDeliveryInfoByID?DeliveryId=${id}`);
}

//Call SBU APi
export function getSBUDDL(accId, buId) {
  return axios.get(
    `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call Distribution Channel APi
export function getDistributionChannelDDL(accId, buId, sbuId) {
  return axios.get(
    `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
  );
}

//Call getSalesOrgDDL APi
export function getSalesOrgDDL(accId, buId, sbuId) {
  return axios.get(
    `/oms/SalesOrder/GetSODDLbySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
  );
}
//Call SoldToPartner Channel APi
export function getSoldToPartner(
  accId,
  buId,
  sbuId,
  shipPoint,
  distributionChannel
) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerSalesOrderDelivaryDDL?accountId=${accId}&businessUnitId=${buId}&Sbuid=${sbuId}&ShipPoint=${shipPoint}&DistributionChannel=${distributionChannel}`
  );
}
//Call getShipToPartner Channel APi
export function getShipToPartner(accId, buId, orderId) {
  return axios.get(
    `/partner/PManagementCommonDDL/GetShipToPartyBySOId?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrderId=${orderId}`
  );
}
