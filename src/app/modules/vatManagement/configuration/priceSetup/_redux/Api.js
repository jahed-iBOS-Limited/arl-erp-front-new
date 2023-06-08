import axios from 'axios'

//call tax item name DDL
export function getTaxItemNameDDL(accId, buId) {
  return axios.get(
    `/vat/TaxDDL/GetTaxItemForSalesDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  )
}
export function getSupplyTypeDDL() {
  return axios.get(
    `/vat/TaxDDL/GetSupplyTypeDDL`
  )
}

//call matItemName DDL
export function getMatItemNameDDL(accId, buId) {
  return axios.get(
    `/vat/TaxDDL/GetTaxItemForPurchaseDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  )
}

//call value Addition DDL
export function getValueAdditionDDL(accId, buId) {
  return axios.get(`/vat/TaxDDL/ValueAdditionNameDDL?accountId=${accId}&businessUnitId=${buId}`)
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/vat/TaxPriceSetup/CreateTaxPriceSetup`, data)
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/vat/TaxPriceSetup/EditTaxPriceSetup`, data)
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize, search) {
  const searchPath = search ? `searchTerm=${search}&` : ''
  return axios.get(
    `/vat/TaxPriceSetup/GetTaxPriceSetupSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  )
}
