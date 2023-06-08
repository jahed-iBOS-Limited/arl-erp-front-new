import axios from "axios";

//Call GetTransportZoneDDL APi
export function getWarehouseDDL(accId, buId) {
  return axios.get(
    `/wms/Warehouse/GetWarehouseFromPlantWarehouseDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/wms/ShipPoint/CreateShipPoint`, data);
}

// Save Edit data
export function saveExtendData(data) {
  return axios.post(`/wms/ShipPoint/CreateShipPointCommon`, data);
}

//Call get grid data api
export function getGridData(accId, buId, pageNo, pageSize,search) {

const searchPath = search ? `searchTerm=${search}&` : "";

  return axios.get(
    `/wms/ShipPoint/GetShipPointListSearchPagination?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(`/wms/ShipPoint/GetShipPointById?Id=${id}`);
}
