import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/SalesOrder/CreateSalesOrder`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(
    `/oms/SalesOrder/SalesOrdersEdit
    `,
    data
  );
}

//Call get grid data api
export function getGridData(
  accId,
  buId,
  shipPointId,
  reportTypeId,
  pageNo,
  pageSize,
  search,
  distributionChannelId
) {
  const searchPath = search ? `searchTerm=${search}&` : "";
  return axios.get(
    `/oms/SalesOrder/GetSalesOrderPaginationSearch?${searchPath}AccountId=${accId}&BUnitId=${buId}&ShipPointId=${shipPointId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&ReportTypeId=${reportTypeId ||
      0}&DistributionChannelId=${distributionChannelId || 0}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitByControllId?ControllingUnitId=${id}`
  );
}
export function getTotalPendingQuantity(accId, buId, soldtoParty, date) {
  return axios.get(
    `/partner/PartnerAllotment/GetTotalPendingQuantity?AccountId=${accId}&BusinessUnitId=${buId}&CustomerId=${soldtoParty}&ItemId=${0}&FromDate=${date}&ToDate=${date}`
  );
}

//Call SBU APi
export function getSBUDDL(accId, buId) {
  return axios.get(
    `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
export function GetTransportZoneDDL(accId, buId) {
  return axios.get(
    `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call getSalesOrgDDL APi
export function getSalesOrgDDL(accId, buId, sbuId) {
  return axios.get(
    `/oms/SalesOrder/GetSODDLbySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
  );
}

//Call Distribution Channel APi
export function getDistributionChannelDDL(accId, buId, sbuId) {
  return axios.get(
    `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
  );
}

//Call getSalesOfficeDDL Channel APi
export function getSalesOfficeDDL(accId, buId, SalesOrgId) {
  return axios.get(
    `/oms/SalesOffice/GetSalesOfficeDDLbyId?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrgId=${SalesOrgId}`
  );
}

//Call getSalesOrderTypeDDL Channel APi
export function getSalesOrderTypeDDL(accId, buId) {
  return axios.get(
    `/oms/SalesOrder/GetSalesOrderTypeConfigDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
//Call getSalesOrderTypeDDL Channel APi
export function getSalesReferanceType() {
  return axios.get(`/oms/SalesOrder/GetOrderReferanceTypeDDL`);
}
//Call getShipPoint Channel APi
export function getShipPoint(userId, accId, buId) {
  return axios.get(
    `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${accId}&BusinessUnitId=${buId}`
  );
}
//Call SoldToPartner Channel APi
// export function getSoldToPartner(accId, buId) {
//   return axios.get(
//     `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
//   );
// }

//Call SoldToPartner Channel APi
export function getSoldToPartner(
  accId,
  buId,
  sbuId,
  salesOrg,
  shipPoint,
  distributionChannel
) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerForSalesOrderDDL?accountId=${accId}&businessUnitId=${buId}&Sbuid=${sbuId}&SalesOrg=${salesOrg}&ShipPoint=${shipPoint}&DistributionChannel=${distributionChannel}`
  );
}

//Call getCurrencyListDDL Channel APi
export function getCurrencyListDDL(accId, buId) {
  return axios.get(
    `/procurement/PurchaseOrder/GetCurrencyListDDL?AccountId=${accId}&UnitId=${buId}`
  );
}
//Call GetOrderReferanceTypeDDL Channel APi
export function getOrderReferanceTypeDDL() {
  return axios.get(`/oms/SalesOrder/GetOrderReferanceTypeDDL`);
}
//Call GetBUalesOrgIncotermDDL Channel APi
export function getBUalesOrgIncotermDDL() {
  return axios.get(`/domain/Payment/GetIncoTermsDDL`);
}
//Call GetPaymentTermsListDDL Channel APi
export function getPaymentTermsListDDL() {
  return axios.get(`/procurement/PurchaseOrder/GetPaymentTermsListDDL`);
}

//Call getShipToPartner Channel APi
export function getShipToPartner(accId, buId, soldToParty) {
  return axios.get(
    `/partner/PManagementCommonDDL/GetBusinessPartnerSalesShippingAddress?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${soldToParty}`
  );
}
//Call GetPaymentTermsListDDL Channel APi
export function getItemPlant(accId, buId, disChaId, salesOrgId) {
  return axios.get(
    `/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${disChaId}&SalesOrgId=${salesOrgId}`
  );
}
//Call getPartnerBalance Channel APi
export function getPartnerBalance(plantId) {
  return axios.get(
    `/partner/BusinessPartnerSales/GetBPartnerBalanceByPartnerId?BusinessPartnerId=${plantId}`
  );
}
//Call getUndeliveryValues Channel APi
export function getUndeliveryValues(soldToParty) {
  return axios.get(
    `/oms/SalesOrder/GetUndeliveryValues?SoldToPartnerId=${soldToParty}`
  );
}
//Call getSalesContactDDL Channel APi
export function getSalesContactDDL(accId, buId, soldToPartyId) {
  return axios.get(
    `/oms/SalesOrder/GetSalesContactDDL?AccountId=${accId}&BUnitId=${buId}&SoldToPartnerId=${soldToPartyId}`
  );
}

//Call GetSalesQuotationDDL Channel APi
export function getSalesQuotationDDL(accId, buId, soldToPartyId, refTypeId) {
  return axios.get(
    `/oms/SalesOrder/GetSalesQuotationDDL?AccountId=${accId}&BUnitId=${buId}&SoldToPartnerId=${soldToPartyId}&TypeId=${refTypeId}`
  );
}

//Call GetSalesQuotationDDL Channel APi
export function getSalesOrderDDL(accId, buId) {
  return axios.get(
    `/oms/SalesOrder/GetSalesOrderDDL?BusinessUnitId=${buId}&AccountId=${accId}`
  );
}
//Call GetSalesQuotationDDL Channel APi
export function getItemUOMDDL(accId, buId) {
  return axios.get(
    `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
//Call GetPriceStructureCheck Channel APi
export function getPriceStructureCheck(partnerId, type) {
  return axios.get(
    `/oms/SalesOrder/GetPriceStructureCheck?PartnerId=${partnerId}&PriceComponentTypeId=${type}`
  );
}
//Call getReferenceItemDetailsById Channel APi
export function getReferenceItemDetailsById(typeId, refId, itemId) {
  return axios.get(
    `/oms/SalesOrder/GetReferenceItemDetailsById?TypeId=${typeId}&Id=${refId}&ItemId=${itemId}`
  );
}
//Call getReferenceItemlistById Channel APi
export function getReferenceItemlistById(typeId, refId) {
  return axios.get(
    `/oms/SalesOrder/GetReferenceItemlistById?Id=${typeId}&TypeId=${refId}`
  );
}
export function GetAllocateItemDDL(accId, buiId, allotmentId) {
  return axios.get(
    `/partner/PartnerAllotment/GetAllocateItemDDL?AccountId=${accId}&BusinessUnitId=${buiId}&AllotmentId=${allotmentId}`
  );
}

//Call getPriceForInternalUse Channel APi
export function getPriceForInternalUse(
  buId,
  partner,
  itemId,
  dtePricingDate,
  terr,
  channelId,
  sorgid
) {
  return axios.get(
    `/oms/SalesOrder/GetPriceForInternalUse?BusinessId=${buId}&intPartner=${partner}&intItemId=${itemId}&dtePricingDate=${dtePricingDate}&intTerr=${terr}&ChannelId=${channelId}&sorgid=${sorgid}`
  );
}
export function getPriceForInternalUseVATAX(
  buId,
  partner,
  itemId,
  dtePricingDate,
  terr,
  channelId,
  sorgid
) {
  return axios.get(
    `/oms/SalesOrder/GetPriceForInternalUseVATTAX?BusinessId=${buId}&intPartner=${partner}&intItemId=${itemId}&dtePricingDate=${dtePricingDate}&intTerr=${terr}&ChannelId=${channelId}&sorgid=${sorgid}`
  );
}
//Call getPriceForInternalUse Channel APi
export function getReferenceWithItemListById(typeId, refId) {
  return axios.get(
    `/oms/SalesOrder/GetReferenceWithItemListById?TypeId=${typeId}&Id=${refId}`
  );
}
//Call getPriceForInternalUse Channel APi
export function getAvailableBalance(partnerId, data, refType) {
  if (data?.length > 0) {
    return axios.get(
      `/oms/SalesOrder/GetUpdatedAvailableBalanceForPartner?pId=${partnerId}&RefType=${refType}`,
      data
    );
  } else {
    return axios.get(
      `/oms/SalesOrder/GetAvailableBalanceForInternalUser?pId=${partnerId}`
    );
  }
}
//Call getDataBySalesOrderId Channel APi
// export function getDataBySalesOrderId(salesOrderId, shipToPartnerId) {
//   return axios.get(
//     `/oms/SalesOrder/GetDataBySalesOrderId?SalesOrderId=${salesOrderId}&ShipToPartnerId=${shipToPartnerId}`
//   );
// }
export function getDataBySalesOrderId(accId, buId, salesOrderId) {
  return axios.get(
    `/oms/SalesOrder/GetDataBySalesOrderId?AccountId=${accId}&BusinessUnit=${buId}&SalesOrderId=${salesOrderId}`
  );
}
//Call getSalesOrderApproval Channel APi
export function getSalesOrderApproval(salesOrderId, approveBy) {
  return axios.put(
    `/oms/SalesOrder/SalesOrderApproval?SalesOrderId=${salesOrderId}&ApproveBy=${approveBy}`
  );
}
//Call getSalesOrderApproval Channel APi
export function uoMitemPlantWarehouseDDL(accountId, buId, plantId, itemId) {
  return axios.get(
    `/wms/ItemPlantWarehouse/GetUoMitemPlantWarehouseDDL?accountId=${accountId}&businessUnitId=${buId}&plantId=${plantId}&ItemId=${itemId}`
  );
}
export function salesOrderApproveCheck(userId) {
  return axios.get(`/oms/SalesOrder/SalesOrderApproveCheck?userId=${userId}`);
}

// Save created data
export function getSalesDiscount(data) {
  return axios.post(`/oms/TradeOfferGet/SalesDiscount`, data);
}
// Save created data
export function getCreditLimitForInternalUser(pId) {
  return axios.get(`/oms/SalesOrder/GetCreditLimitForInternalUser?pId=${pId}`);
}
export function GetSalesConfigurationBalanceCheck(accId, buId) {
  return axios.get(
    `/oms/SalesOffice/GetSalesConfiguration?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
