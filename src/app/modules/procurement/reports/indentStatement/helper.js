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
    const res = await Axios.get(
      `/asset/Asset/GetAssetReportForEmployee?AccountId=${accId}&UnitId=${buId}&ActionBy=${userId}&Type=${value}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
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

export const getPurchaseRequestLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  sbu,
  poId,
  plantId,
  whId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  sortType,
  search,
  itemCtgId
) => {
  setLoading(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  try {
    const res = await Axios.get(
      `/procurement/PurchaseRequest/GetIndentStatement?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&SortType=${sortType}&Sbu=${sbu}&PurchaseOrganizationId=${poId}&Plant=${plantId}&WearHouse=${whId}&fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&ItemCategoryId=${itemCtgId || 0}&ItemTypeId=0&viewOrder=desc`
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
export const getItemCategoryDDLByTypeApi = async (
  accId,
  buId,
  itemType,
  setter
) => {
  setter([]);
  try {
    const res = await Axios.get(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemType}`
    );
    let dataMapping = res?.data?.map((data) => {
      return {
        value: data?.itemCategoryId,
        label: data?.itemCategoryName,
      };
    });
    setter(dataMapping);
  } catch (error) {}
};
export const getItemTypeListDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/wms/WmsReport/GetItemTypeListDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};