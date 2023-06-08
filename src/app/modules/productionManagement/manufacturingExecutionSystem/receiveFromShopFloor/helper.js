import Axios from "axios";
import { toast } from "react-toastify";

export const getSBUDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// OrgUnitTypeId=7 for Plant
export const getPlantDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
// OrgUnitTypeId=7 for WareHouse
export const getWareHouseDDL_api = async (
  userId,
  accId,
  buId,
  plantId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getRefferenceCode_api = async (
  accId,
  buId,
  wareHouseId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/ShopFloor/GetReceiveFromShopFloorDDL?accountId=${accId}&businessUnitId=${buId}&warehouseId=${wareHouseId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemList_api = async (
  accId,
  buId,
  wareHouseId,
  shopFloorInventoryTransactionId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/ShopFloor/GetReceiveFromShopFloorDetails?accountId=${accId}&businessUnitId=${buId}&warehouseId=${wareHouseId}&shopFloorInventoryTransactionId=${shopFloorInventoryTransactionId}`
    );
    if (res.status === 200 && res?.data) {
      let reArrangedData = res?.data.map((item) => ({
        value: item?.itemId,
        label: item?.itemName,
        itemCode: item?.itemCode,
        uom: item?.uomName,
        uomId: item?.uomId,
        transferQty: item?.transactionQuantity,
        location: item?.inventoryLocationName,
        binNumber: item?.binNumber,
        receiveQty: item?.receiveQty,
        transactionRate: item?.transactionRate,
        transactionValue: item?.transactionValue,
        locationId: item?.inventoryLocationId,
      }));
      setter(reArrangedData);
    }
  } catch (error) {}
};

export const getSingleData = async (id, setter, setRowDto) => {
  try {
    const res = await Axios.get(
      `/mes/ShopFloor/GetReceiveFromShopFloorById?InventoryTransactionId=${id}`
    );
    if (res.status === 200 && res?.data) {
      const header = {
        referenceCode: {
          value: res?.data[0]?.inventoryTransactionId,
          label: res?.data[0]?.inventoryTransactionCode,
        },
        item: {
          value: res?.data[0]?.itemId,
          label: res?.data[0]?.itemName,
        },
        transactionDate: res?.data[0]?.transactionDate
      };

      const row = res?.data;

      setter(header);
      setRowDto(row);
    }
  } catch (error) {}
};

// create
export const createReceiveFromShopFloor = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/mes/ShopFloor/CreateReceiveFromShopFloor`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getReceiveShopFloorLandingAction = async (
  accId,
  buId,
  sbuId,
  plantId,
  warehouseId,
  pageNo,
  pageSize,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/mes/ShopFloor/GetReceiveFromShopFloorPagination?accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}&plantId=${plantId}&warehouseId=${warehouseId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};
