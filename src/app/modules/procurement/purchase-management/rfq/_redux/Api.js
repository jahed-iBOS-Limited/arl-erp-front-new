import axios from 'axios'

//save rfq create data
export function saveCreateData(data) {
  return axios.post(
    `/procurement/RequestForQuotation/CreateRequestForQuotation`,
    data
  )
}

//save rfq edited data
export function saveEditedData(data) {
  return axios.put(
    `/procurement/RequestForQuotation/EditRequestForQuotation`,
    data
  )
}

//save quotation entry
export function saveQuotationEntryData(data) {
  return axios.post(`/procurement/RequestForQuotation/CreateRFQEntryPage`, data)
}
// https://localhost:44367/procurement/RequestForQuotation/UpdateRFQEntryPage
export function updateQuotationEntryData(data) {
  return axios.put(`/procurement/RequestForQuotation/UpdateRFQEntryPage`, data)
}

//save cs data
export function saveCSData(data) {
  return axios.post(``, data)
}

// rfq grid data
export function getGridData(
  accId,
  buId,
  plantId,
  warehouseId,
  sbuId,
  POId,
  reqId
) {
  return axios.get(
    `/procurement/RequestForQuotation/GetRequestForQuotationPasignation?AccountId=${accId}&UnitId=${buId}&RequestTypeId=${reqId}&SBUId=${sbuId}&PurchaseOrganizationId=${POId}&PlantId=${plantId}&WearHouseId=${warehouseId}&status=true&viewOrder=desc&PageNo=1&PageSize=100`
  )
}

// rfq quotation entry grid data
export function getQuotationData(accId, buId, rfqId) {
  return axios.get(
    `/procurement/RequestForQuotation/GetRFQQuotationEntry?AccountId=${accId}&BusinessUnitId=${buId}&RFQId=${rfqId}&status=true&viewOrder=desc&PageNo=1&PageSize=100`
  )
}

// rfq cs grid data
export function getCsData(accId, buId, rfqId) {
  return axios.get(
    `/procurement/RequestForQuotation/GetRFQCS?AccountId=${accId}&BusinessUnitId=${buId}&RequestForQuotationId=${rfqId}&status=true&viewOrder=desc&PageNo=1&PageSize=100`
  )
}

//Call single data api
export function getDataById(rfqId) {
  return axios.get(
    `/procurement/RequestForQuotation/GetRequestForQuotationById?RequestForQuotationId=${rfqId}`
  )
}

//item ddl
export function getItemDDL(accId, buId, plantId, whId) {
  return axios.get(
    `/wms/ItemPlantWarehouse/GetItemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&WhId=${whId}`
  )
}
// https://localhost:44367/procurement/RequestForQuotation/GetRFQItemWithoutRef?AccountId=2&BusinessUnitId=164&PlantId=68&WarehouseId=122
export function getItemDDLWithOutRef(accId, buId, plantId, whId) {
  return axios.get(
    `/procurement/RequestForQuotation/GetRFQItemWithoutRef?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&WarehouseId=${whId}`
  )
}
// /wms/ItemPlantWarehouse/GetItemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&WhId=${whId}

// item ddl when reference type === with reference
export function getItemDDLWithRef(
  accId,
  buId,
  sbu,
  poId,
  plantId,
  whId,
  prId,
  ref
) {
  return axios.get(
    // `/procurement/RequestForQuotation/GetRFQItemDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu}&PurchaseOrganizationId=${poId}&PlantId=${plantId}&WearHouseId=${whId}&PurchaseRequestId=${prId}&Referrence=${ref}`
    `/procurement/RequestForQuotation/GetRFQItemDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu}&PurchaseOrganizationId=${poId}&PlantId=${plantId}&WearHouseId=${whId}&PurchaseRequestId=${prId}`
  )
}

//ref no ddl
export function getRefNoDDL(accId, buId, sbuId, POId, plantId, wareHouseId) {
  return axios.get(
    `/procurement/RequestForQuotation/GetPRReferrenceNoDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}&PurchaseOrganizationId=${POId}&PlantId=${plantId}&WearHouseId=${wareHouseId}`
  )
}

//uom ddl
export function getUomDDL(accId, buId, itemId) {
  return axios.get(
    `/procurement/RequestForQuotation/GetRFQUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}`
  )
}
