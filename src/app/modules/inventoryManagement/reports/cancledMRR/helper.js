import Axios from 'axios';

export const getTransactionGroupList = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetTransectionGroupDDL`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getCancledMRRLanding = async (
  setLoading,
  setter,
  sbu,
  plantId,
  whId,
  fromDate,
  toDate
) => {
  setLoading(true);
  //const searchPath = search ? `search=${search}&` : "";
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetInventoryTransectionMRRCancelReport?sbuId=${sbu}&plantId=${plantId}&warehouseId=${whId}&fromDate=${fromDate}&toDate=${toDate}`
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
