import Axios from 'axios';
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
  } catch (error) {}
};

//InventoryStatement_api Api call
export const inventoryStatement_api = async (
  setLoading,
  accId,
  buId,
  warehouseId,
  plantId,
  itemType,
  itemcatId,
  itemSubId,
  setter,
  setinventoryStatementAllData,
  search
) => {
  setLoading(true);
  const searchPath = search ? `search=${search}&` : '';
  try {
    const res = await Axios.get(
      //`/wms/WmsReport/InventoryStatement?accountId=${accId}&businessUnitId=${buId}&warehouseId=${warehouseId}&plantId=${plantId}&itemCategoryId=${itemcatId}&itemSubCategoryId=${itemSubId}&fromDate=${fromDate}&toDate=${toDate}`
      `/wms/ItemPlantWarehouse/GetItemPlantWHCurrentStock?${searchPath}&accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&warehouseId=${warehouseId}&itemTypeId=${itemType}&itemCategoryId=${itemcatId}&itemSubCategoryId=${itemSubId}&PageNo=${1}&PageSize=${9000}&viewOrder=desc`
    );
    setLoading(false);
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
      setinventoryStatementAllData(res?.data?.data);
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
      `/wms/WmsReport/InventoryLedger?accountId=${accId}&businessUnitId=${buId}&warehouseId=${warehouseId}&plantId=${plantId}&fromDate=${fromDate}&toDate=${toDate}&openingQty=${openingQty}&openingValue=${openingValue}&closingQty=${closingQty}&closingValue=${closingValue}&itemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
