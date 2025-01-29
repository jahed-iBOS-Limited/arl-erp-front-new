/* eslint-disable eqeqeq */
import axios from "axios";

//Call ordertype ddl APi
export function getOrderTypeListDDL(accId, buId) {
  return axios.get(`/procurement/PurchaseOrder/GetOrderTypeListDDL`);
}

export function getSupplierNameDDL(accId, buId, sbuId) {
  return axios.get(
    `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${sbuId}`
  );
}

export function getCurrencyDDL(accId, orgId, buId) {
  return axios.get(
    `/procurement/BUPurchaseOrganization/GetPurchaseOrgCurrencyList?intPurchaseOrgId=${orgId}&intAccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call payment terms list ddl APi
export function getPaymentTermsListDDL() {
  return axios.get(`/procurement/PurchaseOrder/GetPaymentTermsListDDL`);
}

//Call incoterms list ddl APi
export function getIncotermListDDL() {
  return axios.get(`/procurement/PurchaseOrder/GetIncotermListDDL`);
}

//Call po reference ddl APi
export function getPOReferenceTypeDDL(orderTypeId) {
  return axios.get(
    `/procurement/PurchaseOrder/getPOReferenceType?PoTypeId=${orderTypeId}`
  );
}

//Call GetPOReferenceNoDDL  APi
export function getPOReferenceNoDDL(RefTypeId, wareHouseId, orderTypeId) {
  return axios.get(
    `/procurement/PurchaseOrder/GetPOReferenceNoDDL?RefTypeId=${RefTypeId}&WarehouseId=${wareHouseId}&PurchaseOrderTypeId=${orderTypeId}`
  );
}

//Call getPOItemDDL based on reference or without reference
export function getPOItemDDL(
  orderTypeId,
  accId,
  buId,
  sbuId,
  orgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) {
  return axios.get(
    `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDL?OrderTypeId=${orderTypeId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${orgId}&PlantId=${plantId}&WearhouseId=${whId}&PartnerId=${partnerId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
    // `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDL?OrderTypeId=${orderTypeId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plantId}&WearhouseId=${whId}&PartnerId=${partnerId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
  );
}

//Call getPOItemDDL based on reference or without reference
export function getServicePOItemDDL(
  accId,
  buId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) {
  return axios.get(
    `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDLByType?AccountId=${accId}&BusinessUnitId=${buId}&PurchaseOrganizationId=${purchaseOrgId}&PlantId=${plantId}&WearhouseId=${whId}&PartnerId=${partnerId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}&ItemTypeId=9`
  );
}

export function getStandradPOItemDDL(
  odId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) {
  return axios.get(
    `/procurement/PurchaseOrderItemDDL/StandardPurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${odId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${purchaseOrgId}&PlantId=${plantId}&WearhouseId=${whId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
  );
}

export function getContractPOItemDDL(
  odId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) {
  return axios.get(
    `/procurement/PurchaseOrderItemDDL/PurchaseContractItemList?ItemTypeId=0&OrderTypeId=${odId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${purchaseOrgId}&PlantId=${plantId}&WearhouseId=${whId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
  );
}

export function getServicePOItemApi(
  odId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) {
  return axios.get(
    `/procurement/PurchaseOrderItemDDL/ServicePurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${odId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${purchaseOrgId}&PlantId=${plantId}&WearhouseId=${whId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
  );
}

export function getAssetPOItemApi(
  odId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) {
  return axios.get(
    `/procurement/PurchaseOrderItemDDL/AssetPurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${odId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${purchaseOrgId}&PlantId=${plantId}&WearhouseId=${whId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
  );
}

export function getReturnPOItemApi(
  odId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) {
  return axios.get(
    `/procurement/PurchaseOrderItemDDL/PurchaseReturnOrderItemList?ItemTypeId=0&OrderTypeId=${odId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PurchaseOrgId=${purchaseOrgId}&PlantId=${plantId}&WearhouseId=${whId}&PartnerId=${partnerId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}`
  );
}

//Call getPOItemDDL based on reference or without reference
export function getPOItemWithoutRefDDL(
  accId,
  buId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) {
  return axios.get(
    `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDLByType?AccountId=${accId}&BusinessUnitId=${buId}&PurchaseOrganizationId=${purchaseOrgId}&PlantId=${plantId}&WearhouseId=${whId}&PartnerId=${partnerId}&RefTypeId=${refTypeId}&RefNoId=${refNoId}&ItemTypeId=10`
  );
}

export function getPlantDDL(userId, accId, buId) {
  return axios.get(
    `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
  );
}

export function getWareHouseDDL(userId, accId, buId, plantId) {
  return axios.get(
    `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
  );
}
//org
export function saveCreateDataForAssetStandardService(data) {
  return axios.post(
    `/procurement/PurchaseOrder/CreateStanderdAssetServicePurchaseOrder`,
    data
  );
}

export function saveCreateDataForReturnStandardService(data) {
  return axios.post(`/procurement/PurchaseOrder/CreatePurchaseReturn`, data);
}

export function saveCreateDataForPurchaseContract(data) {
  return axios.post(`/procurement/PurchaseOrder/CreatePurchaseContact`, data);
}

export function editCreateDataForAssetStandardService(data) {
  return axios.put(`/procurement/EditPurchaseOrder/EditPurchaseOrder`, data);
}

export function editPurchaseReturnApi(data) {
  return axios.put(
    `/procurement/EditPurchaseOrder/EditReturnPurchaseOrder`,
    data
  );
}

export function editCreateDataForPurchaseContract(data) {
  return axios.put(`/procurement/EditPurchaseOrder/EditPurchaseContact`, data);
}

export function getGridData(
  accId,
  buId,
  sbuId,
  plantId,
  whId,
  poTypeId,
  pOrgId,
  refTypeId,
  status,
  fromDate,
  toDate,
  PageNo,
  pageSize,
  searchValue,
  isClose
) {
  const isCloseCheck = isClose ? (isClose === "Close" ? true : false) : false;
  const isStatus = status === "Close" ? false: status
  const searchPath = searchValue ? `&searchTerm=${searchValue}` : "";
  const pageNo = searchValue ? 0 : PageNo;

  const requestUrl =
  isStatus !== undefined && fromDate && toDate
      ? `/procurement/PurchaseOrder/GetPurchaseOrderInformationPasignation?AccountId=${accId}&UnitId=${buId}&Sbu=${sbuId ||
          0}&Plant=${plantId || 0}&WearHouse=${whId ||
          0}&PurchaseOrderTypeId=${poTypeId ||
          0}&PurchaseOrganizationId=${pOrgId ||
          0}&ReferenceTypeId=${refTypeId ||
          0}&isApproved=${isStatus}&fromDate=${fromDate}&toDate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchPath}&isClose=${isCloseCheck}`
      : fromDate && toDate
      ? `/procurement/PurchaseOrder/GetPurchaseOrderInformationPasignation?AccountId=${accId}&UnitId=${buId}&Sbu=${sbuId ||
          0}&Plant=${plantId || 0}&WearHouse=${whId ||
          0}&PurchaseOrderTypeId=${poTypeId ||
          0}&PurchaseOrganizationId=${pOrgId ||
          0}&ReferenceTypeId=${refTypeId ||
          0}&fromDate=${fromDate}&toDate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchPath}&isClose=${isCloseCheck}`
      : fromDate
      ? `/procurement/PurchaseOrder/GetPurchaseOrderInformationPasignation?AccountId=${accId}&UnitId=${buId}&Sbu=${sbuId ||
          0}&Plant=${plantId || 0}&WearHouse=${whId ||
          0}&PurchaseOrderTypeId=${poTypeId ||
          0}&PurchaseOrganizationId=${pOrgId ||
          0}&ReferenceTypeId=${refTypeId ||
          0}&fromDate=${fromDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchPath}&isClose=${isCloseCheck}`
      : toDate
      ? `/procurement/PurchaseOrder/GetPurchaseOrderInformationPasignation?AccountId=${accId}&UnitId=${buId}&Sbu=${sbuId ||
          0}&Plant=${plantId || 0}&WearHouse=${whId ||
          0}&PurchaseOrderTypeId=${poTypeId ||
          0}&PurchaseOrganizationId=${pOrgId ||
          0}&ReferenceTypeId=${refTypeId ||
          0}&toDate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchPath}&isClose=${isCloseCheck}`
      : isStatus !== undefined
      ? `/procurement/PurchaseOrder/GetPurchaseOrderInformationPasignation?AccountId=${accId}&UnitId=${buId}&Sbu=${sbuId ||
          0}&Plant=${plantId || 0}&WearHouse=${whId ||
          0}&PurchaseOrderTypeId=${poTypeId ||
          0}&PurchaseOrganizationId=${pOrgId ||
          0}&ReferenceTypeId=${refTypeId ||
          0}&isApproved=${isStatus}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchPath}&isClose=${isCloseCheck}`
      : `/procurement/PurchaseOrder/GetPurchaseOrderInformationPasignation?AccountId=${accId}&UnitId=${buId}&Sbu=${sbuId ||
          0}&Plant=${plantId || 0}&WearHouse=${whId ||
          0}&PurchaseOrderTypeId=${poTypeId ||
          0}&PurchaseOrganizationId=${pOrgId ||
          0}&ReferenceTypeId=${refTypeId ||
          0}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchPath}&isClose=${isCloseCheck}`;

  return axios.get(requestUrl);
}

export function getSingleData(id, poType) {
  let API;
  if (poType == 2) {
    API = `/procurement/PurchaseOrder/getPurchaseContactHeaderInfo?PurchaseContactId=${id}`;
  } else {
    API = `/procurement/PurchaseOrder/GetPurchaseOrderInformationByPO_Id?PurchaseOrderId=${id}`;
  }

  return axios.get(API);
}

export function getSingleforReturnData(id) {
  //purchase return id
  return axios.get(
    `/procurement/PurchaseOrder/GetPurchaseOrderInformationByReturnPO_Id?PurchaseOrderId=${id}`
  );
}
