import axios from "axios";

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
// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/SalesContact/CreateSalesContact`, data);
}
// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/SalesContact/EditSalesContact`, data);
}
//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize, search) {
  const searchPath = search ? `searchTerm=${search}&` : "";

  return axios.get(
    `/oms/SalesContact/GetSalesContactSearchPasignation?${searchPath}AccountId=${accId}&BUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}
//Call single data api
export function getDataById(accId, buId, id) {
  return axios.get(
    `/oms/SalesContact/GetSalesContactById?AccountId=${accId}&BUnitId=${buId}&SalesContactId=${id}`
  );
}

// sales organization ddl
export function getSalesOrgDDL_api(accId, buId) {
  return axios.get(
    `/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}

export function getDeliveryAddress(accId, buId, partnerId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerDeliveryAddress?accountId=${accId}&businessUnitId=${buId}&BusinessPartnerId=${partnerId}`
  );
}
