import Axios from "axios";

export const getWarehouseDDL = async  ({ buId, plantId, setter }) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/MntWareHouse?UnitId=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};



export const getMaintenanceReport = async ({
  warehouseId,
  part,
  businessUnitId,
  plantId,
  reportType,
  status,
  fromDate,
  toDate,
  intReffId,
  setter,
  setLoading
}) => {
  setLoading(true);
  try {
    const res = await Axios.get(`/asset/Asset/GetAssetManitenanceRPT?intPart=${part}&intUnitId=${businessUnitId}&intPlantId=${plantId}&dteFrom=${fromDate}&dteTo=${toDate}&intReffId=${intReffId}&intRptType=${reportType}&whid=${warehouseId}&status=${status}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);

  }
};


