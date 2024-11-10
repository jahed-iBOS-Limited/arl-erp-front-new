import axios from "axios";

// call getItemDDL
export function getItemDDL(accId, buId, plantId) {
  return axios.get(
    `/wms/ItemPlantWarehouse/GetItemNameitemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}`
  );
}

//Call uom  ddl
export function getuomDDL(accId, buId, plantId, itemId) {
  return axios.get(`/wms/ItemPlantWarehouse/GetUoMitemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=1&ItemId=20
    `);
}

//Call copy from ddl
export function getcopyFromDDL(accId, buId) {
  return axios.get(
    `/mes/BOM/GetBOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//get bomlist data from server
export function getBomListData(bomId) {
  return axios.get(`/mes/BOM/GetRowBOMlist?BOMId=${bomId}`);
}

// get net weight
export function getnetWeight(accId, buId, plantId, itemId) {
  return axios.get(`/wms/ItemPlantWarehouse/GetNetWeight?accountId=
    ${accId}&businessUnitId=${buId}&plantId=${plantId}&itemId=${itemId}`);
}

//save bill of material create data
export function saveCreateData(data) {
  return axios.post(`/mes/BOM/CreateBillOfMaterial`, data);
}

//save bill of material edited data
export function saveEditedData(data) {
  return axios.put(`/mes/BOM/EditBillOfMaterial`, data);
}

//Call bom get grid data api
export function getGridData(accId, buId) {
  return axios.get(
    `/mes/BOM/GetBOMPasignation?AccountId=${accId}&BusinessUnitId=${buId}&Status=true&viewOrder=desc&PageNo=1&PageSize=100`
  );
}

//Call bom view modal data
export function getViewModal(accId, buId, bomId) {
  return axios.get(
    `/mes/BOM/GetBOMView?AccountId=${accId}&BusinessUnitId=${buId}&BOMId=${bomId}`
  );
}
