import axios from "axios";
import { APIUrl } from "../../../App";

// Business Unit DDL
export function getBUDDL(accId, buId) {
  return axios.get(
    `/domain/BusinessUnitDomain/GetBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// Plant DDL
export function getPlantDDL(userId, accId, buId) {
  return axios.get(
    `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
  );
}

// SBU DDL
export function getSbuDDL(accId, buId) {
  return axios.get(
    `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
  );
}

// item sale ddl
export function getItemSaleDDL(accId, buId) {
  return axios.get(
    `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}
export function getYIDByEnrollId(empId) {
  return axios.get(
    `/mes/ProductionEntry/GetYIDByEnrollId?EnrollId=${empId}`
  );
}

// shipping point ddl
export function getShippingDDL(accId, buId) {
  return axios.get(
    `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

// cost center DDL
export function getCostCenterDDL(accId, buId, cuId) {
  return axios.get(
    `/costmgmt/CostCenter/GetCostCenterDDLForControllingUnit?AccountId=${accId}&BusinessUnitId=${buId}&ControllingUnitId=${cuId}`
  );
}

// currency DDL
export function getCurrencyDDL() {
  return axios.get(`/domain/Purchase/GetBaseCurrencyList`);
}

//purchase org ddl
export function getPurchaseOrgDDL(accId, buId) {
  return axios.get(
    `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//wareHouse ddl
export function getWareHouseDDL(query) {
  return axios.get(
    `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?${query}`
  );
}

// Uom ddl
export function getUomDDL(accId, buId) {
  return axios.get(
    `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// Uom ddl
export function getuomDDLItemId(accId, buId, itemId) {
  return axios.get(
    `/item/ItemUOM/GetItemUoMconverstionDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}`
  );
}

// country ddl
export function getCountryDDL() {
  return axios.get(`/domain/CreateSignUp/GetCountryList`);
}

// partner ddl
export function getPartnerDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

// controlling unit ddl
export function getControllingUnitDDL(accId, buId) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// sales office ddl by org id
export function getSalesOfficeDDL(accId, buId, salesOrgId) {
  return axios.get(
    `/oms/SalesOffice/GetSalesOfficeDDLbyId?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrgId=${salesOrgId}`
  );
}

// sales organization ddl
export function getSalesOrgDDL(accId, buId) {
  return axios.get(
    `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// distribution channel ddl
export function getDistributionChannelDDL(accId, buId) {
  return axios.get(
    `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
  );
}

// supplier ddl
export function getSupplierDDL(accId, buId) {
  console.log(accId, buId);
  return axios.get(
    `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// Api for employee ddl
export function getEmpDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// Api for PMSFrequency ddl
export function getPMSFrequencyDDL() {
  return axios.get(`/pms/CommonDDL/PMSFrequencyDDL`);
}
// Api for getDownlloadFileView
export function getDownlloadFileView(id) {
  return axios.get(
    `${APIUrl}/domain/Document/DownlloadFile?id=${id}`
  );
}
// Api for getDownlloadFileView
export function getGenerateExcelDataFormat(data) {
  return axios.get(
    `/domain/GenerateDataFormat/GenerateExcelDataFormat?name=test&headlist=jahed%2C%20tarek`
  );
}
export function getShippointDDL(userId,clientId, buId ) {
  return axios.get(
    `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${clientId}&BusinessUnitId=${buId}`
  );
}
export function createERPUserInfo(paylaod) {
  return axios.post(
    `/domain/CreateUser/CreateERPUserInfo`, paylaod
  );
}
