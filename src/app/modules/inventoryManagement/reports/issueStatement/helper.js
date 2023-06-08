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


export const getIssueStatementLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  sbu,
  plantId,
  whId,
  fromDate,
  toDate,
  itemType,
  itemCategory,
  itemSubCategory,
  costCenterId,
  pageNo,
  pageSize,
  search
) => { 
  setLoading(true);
  const searchPath = search ? `&Search=${search.trim()}` : "";
  const itemTypeId = itemType ? `&itemTypeId=${itemType}`:""
  const itemCategoryId = itemCategory ? `&itemCategoryId=${itemCategory}`:""
  const itemSubCategoryId = itemSubCategory ? `&itemSubCategoryId=${itemSubCategory}`:""
  const costCenterIdQuery = costCenterId? `&costCenterId=${costCenterId}` : ""
  try {
    const res = await Axios.get(
     // `/wms/InventoryTransaction/IssueStatement?${searchPath}InventoryTransectionGroupId=2&accountId=${accId}&fromDate=${fromDate}&toDate=${toDate}&businessUnitId=${buId}&sbuId=${sbu}&plantId=${plantId}&warehouse=${whId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    //  https://localhost:5001/wms/InventoryTransaction/GetIssueStatement?BusinessUnitId=8&SbuId=19&WhId=28&PlantId=12&FromDate=2021-8-1&ToDate=2021-8-9&PageNo=0&PageSize=11&Search=IR-APFIL-AUG21-10

     `/wms/InventoryTransaction/GetIssueStatement?BusinessUnitId=${buId}&SbuId=${sbu}&WhId=${whId}&PlantId=${plantId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo || 1}&PageSize=${pageSize}${searchPath}${itemTypeId}${itemCategoryId}${itemSubCategoryId}${costCenterIdQuery}`
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


export const getItemCategoryDDLByTypeId_api = async (
  accId,
  buId,
  itemTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetItemCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${itemTypeId}`
    );
    if (res.status === 200 && res?.data) {
      // const modifiedData = res?.data?.map((item) => ({
      //   value: item.itemCategoryId,
      //   label: item.itemCategoryName,
      // }));
      // const DDLData = [{ value: 0, label: "All" }, ...modifiedData];

      setter(res.data);
    }
  } catch (error) {}
};

export const ItemSubCategory_api = async (accId, buId, caId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetItemSubCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemCategoryId=${caId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
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


export const getItemRequestDepartmentList = async (businessUnitId, warehouseId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetItemRequestDepartmentList?businessUnitId=${businessUnitId}&warehouseId=${warehouseId}`
    );
    setter(res?.data);
  } catch (error) {}
};

