import axios from 'axios'

//Call get grid data api
export function getGridData(accId, buId) {
  return axios.get(
    `/vat/BusinessUnitTaxConfig/GetBusinessUnitTaxConfigPagination?accountId=${accId}&businessUnitId=${buId}&PageNo=1&PageSize=1000&viewOrder=desc`
  )
}

// Save created data
export function saveCreateData(data) {
  return axios.post(
    `/vat/BusinessUnitTaxConfig/CreateBusinessUnitTaxConfig`,
    data
  )
}
