import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/oms/ProductDivisionType/CreateProductDivisionType`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/oms/ProductDivisionType/EditProductDivisionType`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize) {
  return axios.get(
    `/oms/ProductDivisionType/GetProductDivisionTypePasignation?accountId=${accId}&businessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/oms/ProductDivisionType/GetProductDivisionTypeById?ProductDivisionTypeId=${id}`
  );
}
