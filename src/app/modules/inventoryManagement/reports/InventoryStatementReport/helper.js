import Axios from "axios";

//businessUnitPlant_api Api call
export const businessUnitPlant_api = async (
  accId,
  buId,
  userId,
  plantId,
  setter,
  typeId = 0
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      if (typeId === 3) {
        const updatedData = [
          {
            value: 0,
            label: "All",
          },
          ...res?.data,
        ];
        setter(updatedData);
      } else {
        setter(res?.data);
      }
    }
  } catch (error) {}
};
//Wearhouse_api Api call
export const wearhouse_api = async (
  accId,
  buId,
  userId,
  plantId,
  setter,
  typeId = 0
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      if (typeId === 3) {
        const updatedData = [
          {
            value: 0,
            label: "All",
          },
          ...res?.data,
        ];
        setter(updatedData);
      } else {
        setter(res?.data);
      }
    }
  } catch (error) {}
};

//InventoryStatement_api Api call
export const inventoryStatement_api = async ({
  type,
  accId,
  buId,
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
  search,
  avgDays,
}) => {
  const searchPath = search ? `&Search=${search}` : "";
  const searchForInvNew = search ? `&search=${search}` : "";
  const typeIdQuery = itemtypeId ? `&itemTypeId=${itemtypeId}` : "";
  const categoryIdQuery = itemcatId ? `&categoryId=${itemcatId}` : "";
  const itemSubIdQuery = itemSubId ? `&subCategoryId=${itemSubId}` : "";
  setLoading(true);

  let api;
  if (type?.value === 2) {
    api = `/wms/WmsReport/InventoryStatementNew?businessUnitId=${buId}&warehouseId=${warehouseId}${typeIdQuery}${categoryIdQuery}${itemSubIdQuery}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}${searchPath}`;
  } else if (type?.value === 3) {
    // api = `/wms/WmsReport/InventoryRegister?AccountId=${accId}&businessUnitId=${buId}&warehouseId=${warehouseId}&fromDate=${fromDate}&toDate=${toDate}${typeIdQuery}${categoryIdQuery}${itemSubIdQuery}&pageNo=${pageNo}&pageSize=${pageSize}${searchPath}`;
    api = `/wms/InventoryTransaction/GetInvnetoryInOutReport?intUnit=${buId}&dteFromDate=${fromDate}&dteToDate=${toDate}&intPlantId=${plantId}&intItemTypeId=${itemtypeId}&intItemId=0&intWarehouseId=${warehouseId}&strSearch=${searchPath}&PageNo=${pageNo}&PageSize=${pageSize}`;
  } else if (type?.value === 4) {
    api = `/wms/WmsReport/InventoryStatementStokeCoverage?businessUnitId=${buId}&whld=${warehouseId}&numAverageDay=${avgDays}${typeIdQuery}${categoryIdQuery}${itemSubIdQuery}&pageNo=${pageNo}&pageSize=${pageSize}${searchPath}`;
  } else if (type?.value === 5) {
    api = `/procurement/Report/GetInventoryStatement?businessUnitId=${buId}&intPlantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&intItemTypeId=${itemtypeId}&itemId=0&warehouseId=${warehouseId}&pageNo=${pageNo}&pageSize=${pageSize}${searchForInvNew}`;
  }else if (type?.value === 6) {
    api = `/procurement/Report/GetInventoryStatementV2?businessUnitId=${buId}&intPlantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&intItemTypeId=${itemtypeId}&itemId=0&warehouseId=${warehouseId}&pageNo=${pageNo}&pageSize=${pageSize}${searchForInvNew}`;
  } else {
    api = `/wms/WmsReport/InventoryRegister?AccountId=${accId}&BusinessUnitId=${buId}&warehouseId=${warehouseId}&plantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&type=${type?.value}&Itemtype=${itemtypeId}&ItemCategory=${itemcatId}&itemSubCategory=${itemSubId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${searchPath}`;
  }

  try {
    const res = await Axios.get(api);
    setLoading(false);
    if (res.status === 200 && res?.data) {
      if ([5,6].includes(type?.value)) {
        const updatedData = res?.data?.map((item) => ({
          ...item,
          closingValues: item?.numCloseQty * item?.numRate,
        }));
        setter(updatedData);
      } else {
        setter(res?.data);
      }
    }
  } catch (error) {
    setLoading(false);
  }
};

//InventoryStatement_api Api call
export const InventoryLedger_api = async (
  buId,
  warehouseId,
  fromDate,
  toDate,
  itemId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/WmsReport/InventoryStatementByIdNew?businessUnitId=${buId}&warehouseId=${warehouseId}&itemId=${itemId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
// new api
export const InventoryLedger_api_new = async (
  buId,
  warehouseId,
  fromDate,
  toDate,
  itemId,
  setter,
  setLoading,
  type
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
     type === 6 ? `https://192.168.7.243:45455/wms/InventoryTransaction/GetInventoryLedgerV2?businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&itemId=${itemId}&warehouseId=${warehouseId}` : `/wms/InventoryTransaction/GetInventoryLedger?businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&itemId=${itemId}&warehouseId=${warehouseId}`
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
  } catch (error) {}
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
  } catch (error) {}
};

export const getItemTypeListDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/wms/WmsReport/GetItemTypeListDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
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
      setter(res.data);
    }
  } catch (error) {}
};

export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {}
};
