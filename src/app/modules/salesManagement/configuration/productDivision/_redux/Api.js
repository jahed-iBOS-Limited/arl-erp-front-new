import axios from "axios";

//Call Product Division APi
export function getProductDivisionTypeDDL(accId, buId) {
  return axios.get(
    `/oms/ProductDivisionType/GetProductDivisionTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}
//Call Parent Division APi
export function getParentDivisionDDL(accId, buId) {
  return axios.get(
    `/oms/ProductDivision/GetProductDivisionByTopParentId?AccountId=${accId}&BUnitId=${buId}`
  );
}
// Save ProductDivision
export function saveCreateData(data) {
  return axios.post(`/oms/ProductDivision/CreateProductDivision`, data);
}
// Save Edit ProductDivision
export function saveEditData(data) {
  return axios.put(`/oms/ProductDivision/EditProductDivision`, data);
}
//Call ProductDivision get grid data api
export function getGridData(accId, buId, pageNo, pageSize, search) {
  const searchPath = search ? `searchTerm=${search}&` : "";
  return axios.get(
    `/oms/ProductDivision/ProductDivisionSearchPagination?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Status=true&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}
//Call single ProductDivision by id
export function getDataById(accId, buId, id) {
  return axios.get(
    `/oms/ProductDivision/GetProductDivisiontById?AccountId=${accId}&BusinessUnitId=${buId}&ProductDivisiontId=${id}`
  );
}
