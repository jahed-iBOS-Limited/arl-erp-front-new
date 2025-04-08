import Axios from 'axios';

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
  const searchPath = search ? `&Search=${search.trim()}` : '';
  const itemTypeId = itemType ? `&itemTypeId=${itemType}` : '';
  const itemCategoryId = itemCategory ? `&itemCategoryId=${itemCategory}` : '';
  const itemSubCategoryId = itemSubCategory
    ? `&itemSubCategoryId=${itemSubCategory}`
    : '';
  const costCenterIdQuery = costCenterId ? `&costCenterId=${costCenterId}` : '';
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

export const getItemRequestDepartmentList = async (
  businessUnitId,
  warehouseId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetItemRequestDepartmentList?businessUnitId=${businessUnitId}&warehouseId=${warehouseId}`
    );
    setter(res?.data);
  } catch (error) {}
};
