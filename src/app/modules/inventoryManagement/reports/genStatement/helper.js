import Axios from "axios";
export const getAssetReceiveReportData = async (
  accId,
  buId,
  userId,
  value,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  const searchPath = search ? `searchTearm=${search}&` : "";
  setLoading(true);
  try {
    const res = await Axios.get(`/asset/Asset/GetAssetReportForEmployee?AccountId=${accId}&UnitId=${buId}&ActionBy=${userId}&Type=${value}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`)
    if (res.status === 200 && res?.data) {     
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};


export const getPurchaseOrgList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getTransactionGroupList = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetTransectionGroupDDL`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getPlantList = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getWhList = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) {}
};


export const getGRNStatementLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  sbu,
  plantId,
  whId,
  fromDate,
  toDate,
  orId,
  pageNo,
  pageSize,
  search
) => { 
  setLoading(true);
  const searchPath = search ? `search=${search}&` : "";
  try {
    // const res = await Axios.get(
    //   `/wms/InventoryTransaction/IssueStatement?${searchPath}InventoryTransectionGroupId=${grId}&accountId=${accId}&fromDate=${fromDate}&toDate=${toDate}&businessUnitId=${buId}&sbuId=${sbu}&plantId=${plantId}&warehouse=${whId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    //   );
    const res = await Axios.get(
      `/wms/GrnStatement/newGrnStatementReport?${searchPath}PurchaseOrganization=${orId}&SbuId=${sbu}&PlantId=${plantId}&WarehouseId=${whId}&FromDate=${fromDate}&Todate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
      );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};


export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {}
};
