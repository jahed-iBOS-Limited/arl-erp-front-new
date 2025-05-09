import Axios from 'axios';

export const getTransactionGroupList = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetTransectionGroupDDL`
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
  const searchPath = search ? `search=${search}&` : '';
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

// export const getSBUList = async (accId, buId, setter) => {
//   try {
//     const res = await Axios.get(
//       `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
//     );
//     setter(res?.data);
//   } catch (error) {}
// };
