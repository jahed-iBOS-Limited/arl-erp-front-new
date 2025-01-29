import axios from "axios";
import { _todayDate } from "./../../../../_helper/_todayDate";

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
export function getIsSubsidyRunning_api(accId, buId) {
  return axios.get(
    `/oms/Shipment/GetIsSubsidyRunning?AccountId=${accId}&BusinessUnitId=${buId}`
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
  return axios.post(`/oms/Shipment/CreateShipmentEntryForForeignSales`, data);
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
  fromDate,
  toDate,
  search,
  pageNo,
  pageSize
) {
  const searchTerm = search ? `&SearchTerm=${search}` : "";
  return axios.get(
    `/oms/Shipment/GetShipmentPasignation?AccountId=${accId}&BUnitId=${buId}&ShipmentId=${ShipmentId}&ReportType=${reportTypeId}&FromDate=${fromDate}&Todate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchTerm}`
  );
}

export function getIncompleteGridData(
  accId,
  buId,
  ShipmentId,
  tillDate,
  search,
  pageNo,
  pageSize
) {
  const searchTerm = search ? `&SearchTerm=${search}` : "";
  return axios.get(
    `/tms/Shipment/ShipmentLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${ShipmentId}&date=${tillDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchTerm}`
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
export function GetItemWeightInfo(ShipmentCode, buId) {
  return axios.get(
    `/wms/ShipmentRequest/GetItemWeightInfo?ShipmentCode=${ShipmentCode}&BusinessUnitId=${buId}`
  );
}

export function getDeliveryItemVolumeInfo(id) {
  return axios.get(`/wms/Delivery/GetDeliveryItemVolumeInfo?DeliveryId=${id}`);
}
//Call GetShipPointDDL APi
export function GetShipPointDDL(accId, buId) {
  return axios.get(
    `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

export function getStockStatusOnShipment(deliveryId, buId) {
  return axios.get(
    `/oms/Shipment/GetStockStatusOnShipment?DeliveryId=${deliveryId}&BusinessunitId=${buId}`
  );
}
//Call single data api
export function saveShipmentId(id, actionId) {
  return axios.post(
    `/wms/InventoryTransaction/CreateInvTransactionByShipmentID?ShipmentId=${id}&ActionBy=${actionId}`
  );
}
export function createShipmentComplete(accId, buid, shipmentId, actionId) {
  return axios.post(
    `/oms/Shipment/CreateShipmentComplete?AccountId=${accId}&BusinessUnitId=${buid}&ShipmentId=${shipmentId}&ShipmentDate=${_todayDate()}&ActionBy=${actionId}`
  );
}

export function saveVehicleWeight(
  ShipmentId,
  loadedWeight,
  UnloadedWeight,
  TotalBundle,
  TotalPieces
) {
  return axios.post(
    `/tms/Shipment/EditVehicleTripLoadOrUnload?shipmentId=${ShipmentId}&ActualLoadeWeight=${loadedWeight}&ActualUnLoadeWeight=${UnloadedWeight}&TotalBundle=${TotalBundle}&TotalPieces=${TotalPieces}`
  );
}
export function getVehicleNo(deliveryId, buId) {
  return axios.get(
    `/tms/Shipment/GetVehicleNo?deliveryId=${deliveryId}&businessUnitId=${buId}`
  );
}
