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

export const getProductionReportData = async ({
  accId,
  buId,
  pId,
  sId,
  billType,
  isMainItem,
  fromDate,
  toDate,
  setter,
  setLoading,
  search
}) => {
  setLoading(true);
  try {
    const searchPath = search ? `Searchterm=${search}&` : "";
    const res = await axios.get(
      // /mes/MESReport/GetProductionReport?businessUnitId=4&plantId=77&shopFloorId=1&fromDate=2022-05-01&toDate=2022-05-31
      `/mes/MESReport/GetProductionReport?${searchPath}&AccountId=${accId}&businessUnitId=${buId}&plantId=${pId}&shopFloorId=${sId}&fromDate=${fromDate}&toDate=${toDate}&billType=${billType || 0}&isMainItem=${isMainItem}`
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
  } catch (error) { }
};