import Axios from "axios";
// import { toast } from "react-toastify";

//businessUnitPlant_api Api call
export const businessUnitPlant_api = async (
  accId,
  buId,
  userId,
  plantId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
//Wearhouse_api Api call
export const wearhouse_api = async (accId, buId, userId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

//InventoryStatement_api Api call
export const inventoryStatement_api = async (
  type,
  accId,
  buId,
  //sbuId,
  warehouseId,
  plantId,
  itemtypeId,
  itemcatId,
  itemSubId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search
) => {
  const searchPath = search ? `Search=${search}&` : "";
  setLoading(true);

  let api;
  if(type?.value === 2){
    // api = `/wms/WmsReport/InventoryStatementNew?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&warehouseId=${warehouseId}&plantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&Itemtype=${itemtypeId}&ItemCategory=${itemcatId}&itemSubCategory=${itemSubId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    api = `/wms/WmsReport/InventoryStatementDetail?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&warehouseId=${warehouseId}&plantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&Itemtype=${itemtypeId}&ItemCategory=${itemcatId}&itemSubCategory=${itemSubId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  } else {
    
    api = `/wms/WmsReport/InventoryRegister?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&warehouseId=${warehouseId}&plantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&type=${type?.value}&Itemtype=${itemtypeId}&ItemCategory=${itemcatId}&itemSubCategory=${itemSubId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  }

  try {
    const res = await Axios.get(api);
    setLoading(false);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

//InventoryStatement_api Api call
export const InventoryLedger_api = async (
  accId,
  buId,
  warehouseId,
  plantId,
  fromDate,
  toDate,
  openingQty,
  openingValue,
  closingQty,
  closingValue,
  itemId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      //`/wms/WmsReport/InventoryLedger?accountId=${accId}&businessUnitId=${buId}&warehouseId=${warehouseId}&plantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&openingQty=${openingQty}&openingValue=${openingValue}&closingQty=${closingQty}&closingValue=${closingValue}&itemId=${itemId}`
      `/wms/WmsReport/InventoryStatementById?accountId=${accId}&businessUnitId=${buId}&warehouseId=${warehouseId}&plantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&itemId=${itemId}&OpenQty=${openingQty}&OpenValue=${openingValue}&CloseQty=${closingQty}&CloseValue=${closingValue}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

//item category Api call
export const ItemCategory_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetItemCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

//ItemSubCategory_api Api call
export const ItemSubCategory_api = async (accId, buId, caId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetItemSubCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemCategoryId=${caId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getItemTypeListDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/wms/WmsReport/GetItemTypeListDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getItemCategoryDDLByTypeId_api = async (
  accId,
  buId,
  itemTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetItemCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
    );
    if (res.status === 200 && res?.data) {
      // const modifiedData = res?.data?.map((item) => ({
      //   value: item.itemCategoryId,
      //   label: item.itemCategoryName,
      // }));
      // const DDLData = [{ value: 0, label: "All" }, ...modifiedData];

      setter(res.data);
    }
  } catch (error) { }
};

export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {}
};


