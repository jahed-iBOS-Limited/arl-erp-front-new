import axios from "axios";

export const getPlantNameDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getBOMItemDDL = async (accId, buId, pId, sfId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetBOMItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${pId}&ShopfloorId=${sfId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getShopfloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
// /mes/MESReport/GetItemBOMReport?itemId=7472&Qty=0&ShoopFloorId=74
export const getBOMReport = async (itemId,shoopFloorId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/MESReport/GetItemBOMReport?itemId=${itemId}&Qty=0&ShoopFloorId=${shoopFloorId}`
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
