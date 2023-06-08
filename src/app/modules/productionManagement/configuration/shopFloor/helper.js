import Axios from "axios";
import { toast } from "react-toastify";

//landingGridData
//Get landingGridData
export const landingGridData = async (
  accId,
  buId,
  plantId,
  setLoader,
  setter,
  pageNo,
  pageSize
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/mes/ShopFloor/ShopFloorLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

//plantNameDDl
export const getPlantNameDDl = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error);
  }
};
// warehouse DDL
export const getWareHouseDDL = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error);
  }
};
// location ddl

export const getInventoryLocationDDL = async (
  accId,
  buId,
  plantId,
  warehouseId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryLocation/GetInventoryLocationDDL?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}&WhId=${warehouseId}`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error);
  }
};
//getShopFloorById
export const getShopFloorById = async (shopFloorId, buId, accId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/ShopFloor/GetShopFloorById?ShopFloorId=${shopFloorId}&BusinessUnitId=${buId}&AccountId=${accId}`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error);
  }
};
//Edit Single Data
export const editSingleData = async (editData, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/mes/ShopFloor/EditShopFloor`, editData);
    if (res?.status === 200) {
      toast.success(res?.data?.message || "Edit Successfully");
      setDisabled(false);
    }
  } catch (err) {
    setDisabled(false);
    toast.warning(err?.response?.data?.message);
  }
};

//saveShopFloor
export const saveShopFloor = async (createData, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/mes/ShopFloor/CreateShopFloor`, createData);
    if (res?.status === 200 && res?.data) {
      toast.success(res?.data?.message || "Save Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.warning(error?.response?.data?.message);
  }
};
