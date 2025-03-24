import Axios from "axios";

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
  if (type?.value === 2) {
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
