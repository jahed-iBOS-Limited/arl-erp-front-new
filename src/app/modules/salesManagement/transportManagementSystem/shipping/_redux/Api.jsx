import axios from 'axios';

//Call GetSalesOfficeDDLbyId APi
export function GetSalesOfficeDDLbyId(accId, buId, SalesOrgId) {
  return axios.get(
    `/oms/SalesOffice/GetSalesOfficeDDLbyId?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrgId=${SalesOrgId}`
  );
}
//Call GetSoldToPartyby APi
export function GetSoldToPPId(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

//Call GetBUalesOrgIncotermDDL APi
export function GetBUsalesOrgIncotermDDL(accId, buId, salesOrgId) {
  return axios.get(
    `/oms/BusinessUnitSalesOrganization/GetBUalesOrgIncotermDDL?AccountId=${accId}&BUnitId=${buId}&SalesOrganizationId=${salesOrgId}`
  );
}

//Call GetPaymentTermsDDL APi
export function GetPaymentTermsDDL() {
  return axios.get(`/oms/SalesOrder/GetPaymentTermsDDL`);
}
//Call GetVehicleDDL APi
export function GetVehicleDDLApi(accId, buId) {
  // /tms/Vehicle/GetAvailableVehicleDDL?AccountId=1&BusinessUnitId=2
  // return axios.get(`/oms/Shipment/GetVehicleDDL?AccountId=1&BUnitId=1`);
  return axios.get(
    `/tms/Vehicle/GetAvailableVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
//Call GetRouteListDDL APi
export function GetRouteListDDLApi(accId, buId) {
  return axios.get(
    `/oms/Shipment/GetTransportRouteListDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}
//Call GetTransportModeDDL APi
export function GetTransportModeDDLApi() {
  return axios.get(`/oms/Shipment/GetTransportModeDDL`);
}
//Call GetTransportZoneDDL APi
export function GetTransportZoneDDLApi(RouteId, BuId) {
  return axios.get(
    `/oms/Shipment/GetTransportZoneDDL?TransportRouteId=${RouteId}&BUnitId=${BuId}`
  );
}
//Call GetShipmentTypeDDL APi
export function GetShipmentTypeDDLApi(ModeId) {
  return axios.get(`/oms/Shipment/GetShipmentTypeDDL?TransportModeId=1`);
}
//Call GetNotDeliverdList APi
export function GetNotDeliverdList(RouteId, BuId, accId) {
  return axios.get(
    `/oms/Shipment/GetNotDeliverdList?Routeid=${RouteId}&Businessunitid=${BuId}&AccountId=${accId}`
  );
}
//Call GetLoadingPointByUnitShipPointId APi
export function GetLoadingPointByUnitShipPointId(BuId, sId) {
  return axios.get(
    `/oms/Shipment/GetLoadingPointByUnitShipPointId?UId=${BuId}&SId=${sId}`
  );
}
//Call getShippointId APi
// export function GetShippointApi(userId, accId) {
//   return axios.get(
//     `/oms/Shipment/GetLoadingPointByUnitShipPointId?UId=1&SId=1`
//   );
// }

//getLoadingPointDDL
export function getLoadingPointDDL(accId, buId, pointId) {
  return axios.get(
    `/oms/LoadingPoint/GetLoadingPointDDL?AccountId=${accId}&BusinessUnitId=${buId}&ShippingPointId=${pointId}`
  );
}

//Call OrganizationalUnitUserPermission APi
export function getPendingDeliveryapi(shippointid, buId, accId) {
  return axios.get(
    `/oms/Shipment/GetNotDeliverdList?ShipPointId=${shippointid}&Businessunitid=${buId}&AccountId=${accId}`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/Shipment/CreateShipmentEntry`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/Shipment/EditShipment`, data);
}

//Call get grid data api
export function getGridData(
  accId,
  buId,
  ShipmentId,
  reportTypeId,
  pageNo,
  pageSize
) {
  return axios.get(
    `/oms/Shipment/GetShipmentPasignation?AccountId=${accId}&BUnitId=${buId}&ShipmentId=${ShipmentId}&ReportType=${reportTypeId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call single data api
export function getDataById(accId, BuId, id) {
  return axios.get(
    `/oms/Shipment/GetShipmentLandingDetailsReport?AccountId=${accId}&Businessunitid=${BuId}&ShipmentId=${id}`
  );
}
export function getpendingDeliveryDataById(id) {
  return axios.get(
    `/oms/Shipment/GetPendingDeliveryInfoByDeliveryId?DeliveryId=${id}`
  );
}
//Call GetPendingDeliveryInfoByDeliveryId api
export function GetPendingDeliveryInfoByDeliveryIdApi(id) {
  return axios.get(
    `/oms/Shipment/GetPendingDeliveryInfoByDeliveryId?DeliveryId=${id}`
  );
}
export function getVehicleInfoByVehicleIdAPI(id, accId, buId) {
  return axios.get(
    `/tms/Vehicle/GetVehicleInfobyNo?vehicleNo=${id}&AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

export function getDeliveryItemVolumeInfo(id) {
  return axios.get(`/wms/Delivery/GetDeliveryItemVolumeInfo?DeliveryId=${id}`);
}
