import axios from "axios";

//Call sales org
export function getSalesOrgDDL(accId, buId) {
  return axios.get(
    `/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}

//Call sales org
export function getSpecificationDDL( buId) {
  return axios.get(
    `/oms/SalesQuotation/GetSpecificationDDL?businessUnitId=${buId}`
  );
}

//Call sales org
export function getSoldToPartyDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/SalesQuotation/CreateSalesQuotation`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/SalesQuotation/EditSalesQuotation`, data);
}
export function editSalesQuotationStatus(QId, actionBy) {
  return axios.put(
    `/oms/SalesQuotation/EditSalesQuotationStatus?QuotationId=${QId}&ActionBy=${actionBy}&QuotationStatus=true`
  );
}

//Call get grid data api
export function getGridData(
  accId,
  buId,
  pageNo,
  pageSize,
  search,
  status,
  fromDate,
  toDate
) {
  const searchPath = search ? `searchTerm=${search}&` : "";

  return axios.get(
    `/oms/SalesQuotation/GetSalesQuotationSearchLandingPagination?${searchPath}AccountId=${accId}&BUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&QuotationStatus=${status}&fromDate=${fromDate}&toDate=${toDate}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/oms/SalesQuotation/GetSalesQuotationById?QuotationId=${id}`
  );
}
