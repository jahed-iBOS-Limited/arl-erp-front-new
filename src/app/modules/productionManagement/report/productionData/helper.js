import axios from "axios";

export const getPlantNameDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getShopfloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetProductionDataReport = async ({
  accId,
  buId,
  sId,
  itemId,
  billType,
  fromDate,
  toDate,
  setter,
  setLoading,
}) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/MESReport/GetProductionDataReport?AccountId=${accId}&BusinessUnitId=${buId}&ShopFloorId=${sId}&fromDate=${fromDate}&toDate=${toDate}&ItemId=${itemId}&BomId=${billType}`
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
// itemName ddl
export const getItemNameDDL = async (accId, buId, plantId, sid, setter) => {
  try {
    const res = await axios.get(
      // previous api - /mes/MesDDL/GetItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}
      `/mes/MesDDL/GetItemNameByBOMandRouting?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${sid}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.label + " [" + item?.code + "]",
          };
        })
      );
    }
  } catch (error) {}
};
