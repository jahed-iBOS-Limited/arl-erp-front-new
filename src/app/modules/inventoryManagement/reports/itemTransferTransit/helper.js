import Axios from "axios";

export const getItemTransferTransitReport = async (
  warehouseId,
  expireType,
  setter,
  setLoading
) => {
  setLoading(true);
  const api = `/wms/WmsReport/GetItemTransferTransitReport?warehouseId=${warehouseId}&expireType=${expireType}`;

  try {
    const res = await Axios.get(api);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getItemTransferTransitByInvTransactionId = async (
  invTransactionId,
  setter,
  setLoading
) => {
  setLoading(true);
  let api = `/wms/WmsReport/GetItemTransferTransitByInvTransactionId?invTransactionId=${invTransactionId}`;
  try {
    const res = await Axios.get(api);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getPlantDDL = async (accId, userId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getWarehouseDDL = async (accId, userId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
