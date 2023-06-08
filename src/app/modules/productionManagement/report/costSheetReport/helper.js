import axios from "axios";

export const GetPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemDDL = async (accId, buId, pId, sfId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetItemNameByBOMandRouting?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${pId}&ShopFloorId=${sfId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getShopFloorDDL = async (accId, buId, pId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${pId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPoBaseReport = async (
  accId,
  buId,
  code,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/MESReport/GetCostSheetGetByPoCode?AccountId=${accId}&BusinessUnitId=${buId}&ProductionOrderCode=${code}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getItemBaseReport = async (
  accId,
  buId,
  fromDate,
  toDate,
  itemId,
  sfId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/MESReport/GetCostSheetGetByItemId?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&ItemId=${itemId}&ShopFlorId=${sfId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getAllItemBaseReport = async (
  accId,
  buId,
  fromDate,
  toDate,
  sfId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/MESReport/GetCostSheetGetByShopfloorId?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${toDate}&ToDate=${fromDate}&ShopFlorId=${sfId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
