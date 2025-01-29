import Axios from "axios";

export const getAssetPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {

  }
};

export const getAssetSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetSbuByUnitId?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {

  }
};

export const getassetWarehouseData = async (
  userId,
  accId,
  buId,
  plId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {

  }
};

export const getGridData = async (
  accId,
  buId,
  plId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  whId,
  status,
  costCenter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/asset/LandingView/GetMntWorkOrderList?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&WhId=${whId}&Status=${status}&CostCenterId=${costCenter}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {

    setLoading(false);
  }
};
