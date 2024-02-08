import axios from "axios";

// Save created data
export function saveCreateData(data) {
  return axios.post(`/wms/InventoryTransaction/CreateInvTransection`, data);
}

// Save created data for issue and return deleviry
export function saveCreateDataforIssue(data) {
  return axios.post(
    `/wms/InventoryTransaction/CreateInvTransectionForIssue`,
    data
  );
}

// Save created data for issue and return deleviry
export function saveCreateDataforpurchaseReturn(data) {
  return axios.post(
    `/wms/InventoryTransaction/CreateInvTransectionForPurchaseReturn`,
    data
  );
}

// Save created data for transafer Inv
export function saveCreateDataforTransfer(data) {
  return axios.post(
    `/wms/InventoryTransaction/CreateTransferInvTransectionW2WandReceive`,
    // `/wms/InventoryTransaction/CreateTransferInvTransection`,
    data
  );
}

// Save created data for release Inv
export function saveCreateDataforRelease(data) {
  return axios.post(
    `/wms/InventoryTransaction/CreateReleaseInvTransection`,
    data
  );
}

// Save created data for release Inv
export function saveCreateDataforRemove(data) {
  return axios.post(
    `/wms/InventoryTransaction/CreateInvTransectionForRemove`,
    data
  );
}

// Save created data for adjust Inv
export function saveCreateDataforAdjustInv(data) {
  return axios.post(
    `/wms/InventoryTransaction/CreateAdjustInvTransection`,
    data
  );
}

// Save created data for cancel Inv posting
export function saveCreateDataforInvPosting(data) {
  return axios.post(`/wms/InventoryTransaction/CreateCancelInvPosting`, data);
}

// Save created data for cancel internal posting
export function saveCreateDataforInternalTransfer(data) {
  return axios.post(
    `/wms/InventoryTransaction/CreateInternalTransferInvTransection`,
    data
  );
}

//Call get grid data api
export function getGridData(
  fromDate,
  toDate,
  grId,
  accId,
  buId,
  sbuId,
  plId,
  wrId,
  PageNo,
  pageSize,
  search
) {
  const searchPath = search ? `searchTerm=${search}&` : "";
  const pageNo = search ? 0 : PageNo;
  return axios.get(
    `/wms/InventoryTransaction/GetInventoryTransectionSearchPagination?${searchPath}InventoryTransectionGroupId=${grId}&accountId=${accId}&fromDate=${fromDate}&toDate=${toDate}&businessUnitId=${buId}&sbuId=${sbuId}&plantId=${plId}&warehouse=${wrId}&status=${true}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call get grid data api for InventoryAdjustment
export function getGridDataInventoryAdjustment(
  fromDate,
  toDate,
  grId,
  accId,
  buId,
  sbuId,
  plId,
  wrId,
  PageNo,
  pageSize,
  search
) {
  const searchPath = search ? `searchTerm=${search}&` : "";
  const pageNo = search ? 0 : PageNo;
  return axios.get(
    `/wms/InventoryTransaction/GetInventoryAdjustmentPagination?${searchPath}InventoryTransectionGroupId=${grId}&accountId=${accId}&fromDate=${fromDate}&toDate=${toDate}&businessUnitId=${buId}&sbuId=${sbuId || 0}&plantId=${plId || 0}&warehouse=${wrId || 0}&status=${true}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitByControllId?ControllingUnitId=${id}`
  );
}

// inventory transactionGrpDDL

//reference type ddl
export function getreferenceTypeDDL(id) {
  return axios.get(
    `/wms/InventoryTransaction/GetReferenceTypeDDL?InvTGoupId=${id}`
  );
}

//reference no ddl
export function getreferenceNoDDL(refTNm, accId, buId, sbuId, plId, whId) {
  return axios.get(
    `/wms/InventoryTransaction/GetReferenceNo?InvTrnsRefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
  );
}

//reference no ddl receive Inv
export function getreferenceNoReceiveInvDDL(
  refId,
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) {
  return axios.get(
    //`/wms/InventoryTransaction/GetReferenceNo?InvTrnsRefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
    `/wms/InventoryTransaction/GetReferenceNoForReceiveInventory?RefTypeId=${refId}&RefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true&IsClosed=false`
  );
}

//reference no ddl receive Inv
export function getreferenceNoTransferInvInvDDL(
  refId,
  accId,
  buId,
  plId,
  whId
) {
  return axios.get(
    `/wms/InventoryTransaction/GetReferenceNoforTransferIn?RefTypeId=23&RefTypeName=Transfer Out&TransectionTypeId=${19}&accountId=${accId}&businessUnitId=${buId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
  );
}

//reference no ddl for issue inventory
export function getreferenceNoDDLForIssue(
  refId,
  refTNm,
  accId,
  buId,
  plId,
  whId
) {
  return axios.get(
    // `/wms/InventoryTransaction/GetReferenceNoforIssue?InvTrnsRefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
    `/wms/InventoryTransaction/GetReferenceNoforIssueInventory?RefTypeId=${refId}&RefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
  );
}

//reference no ddl for return deleviry
export function getreferenceNoDDLForReturnDeleviry(
  refId,
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) {
  return axios.get(
    // `/wms/InventoryTransaction/GetReferenceNoForReturnDelivery?InvTrnsRefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true&IsClosed=false`
    `/wms/InventoryTransaction/GetReferenceNoForReturnDelivery?RefTypeid=${refId}&RefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true&IsClosed=false`
  );
}

//reference no ddl for Transfer inventory
export function getreferenceNoDDLForTransferInv(
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) {
  return axios.get(
    `/wms/InventoryTransaction/GetReferenceNoForTransferInventory?InvTrnsRefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true&IsClosed=false `
  );
}

//reference no ddl for Transfer inventory
export function getreferenceNoDDLForReleaseInv(
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) {
  return axios.get(
    `/wms/InventoryTransaction/GetReferenceNoForReleaseInventory?InvTrnsRefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
  );
}

//reference no ddl for Cancel inventory
export function getreferenceNoDDLForCancelInv(
  rfId,
  refTNm,
  accId,
  buId,
  sbuId,
  plId,
  whId
) {
  return axios.get(
    // `/wms/InventoryTransaction/GetReferenceNoForCancelInvtory?InvTrnsRefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
    `/wms/InventoryTransaction/GetReferenceNoForCancelInventory?RefTypeId=${rfId}&RefTypeName=${refTNm}&accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
  );
}

//getTransactionTypeDDL ddl
export function getTransactionTypeDDL(GrpId, refTId) {
  return axios.get(
    `/wms/InventoryTransaction/GetTransectionTypeDDL?InvTGoupId=${GrpId}&RefenceTypeId=${refTId}`
  );
}

//getTransactionTypeDDL ddl for cencel inventory
export function getTransactionTypeDDLForCencelInv(refNoId) {
  return axios.get(
    `/wms/InventoryTransaction/GetTransectionTypeByInvTransactionId?InvTransId=${refNoId}`
  );
}

export function getbusiPartnerDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

export function getpersonelDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

export function getItemDDL(accId, buId, plId, whId) {
  return axios.get(
    `/wms/ItemPlantWarehouse/GetItemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plId}&WhId=${whId}`
  );
}

export function getItemForInternalDDL(accId, buId, plId, whId) {
  return axios.get(
    //`/wms/ItemPlantWarehouse/GetItemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plId}&WhId=${whId}`
    `/wms/InventoryTransaction/GetItemForInternalTransferInventory?accountId=${accId}&businessUnitId=${buId}&plantId=${plId}&whId=${whId}`
  );
}

export function getAdjustInvItemDDL(accId, buId, plId, whId) {
  return axios.get(
    `/wms/InventoryTransaction/GetItemForAdjustInventory?accountId=${accId}&businessUnitId=${buId}&plantId=${plId}&whId=${whId}`
  );
}

export function getTransferInInvItemDDL(transId) {
  return axios.get(
    `/wms/InventoryTransaction/GetItemForTransferIn?RefNo=${transId}`
  );
}

export function getItemForWithoutRefDDLreceiveInv(
  accId,
  buId,
  plId,
  whId,
  prId
) {
  return axios.get(
    `/wms/ItemPlantWarehouse/GetItemPlantWarehouseDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plId}&WhId=${whId}&ItemType=0&partnerId=${prId}`
  );
}

export function getCostCenterDDL(accId, buId, sbuId) {
  return axios.get(
    `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
  );
}

export function getProjectNameDDL(accId, buId) {
  return axios.get(
    `/costmgmt/ProjectName/GetProjectNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

export function getStockDDL() {
  return axios.get(`/wms/InventoryTransaction/GetInventoryStockDDL`);
}

export function getLocationTypeDDL(accId, buId, plId, whId) {
  return axios.get(
    `/wms/InventoryLocation/GetInventoryLocationDDL?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plId}&WhId=${whId}`
  );
}

export function getLocationTypeDDLForInternal(accId, buId, plId, whId, ItemId) {
  return axios.get(
    `/wms/InventoryLocation/GetInventoryLocationDDLfromItemPlantWarehouse?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plId}&WhId=${whId}&ItemId=${ItemId}`
  );
}

export function getItemWithRefTypeDDL(refName, refNo) {
  return axios.get(
    `/wms/InventoryTransaction/GetItemByInvRefNoRefType?RefType=${refName}&RefNo=${refNo}`
  );
}

export function getItemWithCancelInvDDL(refId, refName, refNo) {
  return axios.get(
    //`/wms/InventoryTransaction/GetItemByInvRefNoRefType?RefType=${refName}&RefNo=${refNo}`
    `/wms/InventoryTransaction/GetItemForCancelInventoryPosting?RefTypeId=${refId}&RefType=${refName}&RefNo=${refNo}`
  );
}

export function getItemWithReturnDeliveryDDL(refId, refName, refNo) {
  return axios.get(
    `/wms/InventoryTransaction/GetItemForReturnDelivery?RefTypeId=${refId}&RefTypeName=${refName}&RefNo=${refNo}`
  );
}

export function getItemWithReceiveInvDDL(refId, refName, refNo) {
  return axios.get(
    `/wms/InventoryTransaction/GetItemForReceiveInventory?RefTypeId=${refId}&RefType=${refName}&RefNo=${refNo}`
  );
}
export function getItemListForIssueReturnDDL(refNo) {
  return axios.get(
    `/wms/InventoryTransaction/GetItemListForIssueReturn?itemRequestId=${refNo}`
  );
}

export function getItemWithReceiveInvForeignDDL(acId, buId, poId, shipId) {
  return axios.get(
    `/wms/InventoryTransaction/GetItemForAllPOByShipmentId?intAccount=${acId}&intUnit=${buId}&intPOId=${poId}&intShipId=${shipId}&intReffTypeId=0`
  );
}

//Get Item for Release Inv
export function getItemForReleaseInv(accId, buId, refId, sbuId, plId, whId) {
  return axios.get(
    //`/wms/InventoryTransaction/GetItemforReleaseInventory?accountId=${accId}&businessUnitId=${buId}&RefId=${refId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}&IsActive=true`
    `/wms/InventoryTransaction/GetReleaseInventoryItemList?accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&plantId=${plId}&wearhouseId=${whId}&refId=${refId}`
  );
}

//Get Item for Remove Inv
export function getItemForRemoveInv(accId, buId, plId, whId, transName) {
  return axios.get(
    `/wms/ItemPlantWarehouse/GetItemPlantWarehouseByReffDDL?accountId=${accId}&businessUnitId=${buId}&plantId=${plId}&WhId=${whId}&Reff=${transName}`
  );
}

//Get Item for transfer Inv
export function getItemForTransferInv(
  accId,
  buId,
  fromplId,
  fromwhId,
  toPlId,
  toWhId
) {
  return axios.get(
    // `/wms/InventoryTransaction/GetItemPlantWarehouseForInventoryLocation?AccountId=${accId}&BusinessUnitId=${buId}&fromPlantId=${fromplId}&fromWarehouseId=${fromwhId}&toPlantId=${toPlId}&toWarehouseId=${toWhId}`
    `/wms/InventoryTransaction/GetItemForWarehouseTransferInventory?AccountId=${accId}&BusinessUnitId=${buId}&fromPlantId=${fromplId}&fromWarehouseId=${fromwhId}&toPlantId=${toPlId}&toWarehouseId=${toWhId}`
  );
}

//get item for issue from
export function getItemForIssue(refId, refName, refNo) {
  return axios.get(
    `/wms/InventoryTransaction/GetItemForIssueInventory?RefTypeId=${refId}&RefTypeName=${refName}&RefNo=${refNo}`
  );
}

export function getSingleDDL(id) {
  return axios.get(
    `/wms/InventoryTransaction/GetInvTransectionById?TransectionId=${id}`
  );
}
export function attachmentSave(data) {
  return axios.post("/domain/Document/UploadFile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
