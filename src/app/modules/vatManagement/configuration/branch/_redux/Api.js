import axios from 'axios'

//Call Buddl APi
export function getBuDDL(accId, buId) {
  return axios.get(
    `/domain/BusinessUnitDomain/GetBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  )
}

//call country DDL
export function getcountryDDL() {
  return axios.get(`/oms/TerritoryInfo/GetCountryDDL`)
}

//call division DDL
export function getdivisionDDL(coId) {
  return axios.get(`/oms/TerritoryInfo/GetDivisionDDL?countryId=${coId}`)
}

//call district DDL
export function getdistrictDDL(coId, divId) {
  return axios.get(
    `/oms/TerritoryInfo/GetDistrictDDL?countryId=${coId}&divisionId=${divId}`
  )
}

//call police Station DDL
export function getpoliceStationDDL(coId, divId, disId) {
  return axios.get(
    `/oms/TerritoryInfo/GetThanaDDL?countryId=${coId}&divisionId=${divId}&districtId=${disId}`
  )
}

//call postcode DDL
export function getpostCodeDDL(thanaId) {
  return axios.get(`/vat/TaxDDL/GetPostcodeByThanaDDL?ThanaId=${thanaId}`)
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/vat/TaxBranch/CreateTaxBranch`, data)
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/vat/TaxBranch/EditTaxBranch`, data)
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/vat/TaxBranch/TaxBranchLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  )
}

//Call single data api
export function getDataById(id) {
  return axios.get(`/vat/TaxBranch/GetTaxBranchById?TaxBrachId=${id}`)
}
