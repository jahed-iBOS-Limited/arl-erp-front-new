import Axios from "axios";
import { toast } from "react-toastify";
// export const getAssetReceiveReportData = async (
//   accId,
//   buId,
//   userId,
//   value,
//   setter,
//   setLoading,
//   pageNo,
//   pageSize,
//   search
// ) => {
//   const searchPath = search ? `searchTearm=${search}&` : "";
//   setLoading(true);
//   try {
//     const res = await Axios.get(`/asset/Asset/GetAssetReportForEmployee?AccountId=${accId}&UnitId=${buId}&ActionBy=${userId}&Type=${value}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`)
//     if (res.status === 200 && res?.data) {
//       setter(res?.data);
//       setLoading(false);
//     }
//   } catch (error) {
//     setLoading(false);
//   }
// };

export const getWhList = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
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
export const getRequestTypeList = async (setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseRequest/GetPurchaseRequestTypeListDDL`
    );
    let data = res?.data?.map((item) => ({
      value: item?.purchaseRequestTypeId,
      label: item?.purchaseRequestTypeName,
    }));
    setter(data);
  } catch (error) {}
};
export const GetPurchaseInfoByItem_api = async (
  itemId,
  whId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPurchaseInfoByItem?itemId=${itemId}&wareHouseId=${whId}&businessUnitId=${buId}`
    );
    setLoading(false);
    if (res?.data?.length === 0) return toast.warn("Data not found");
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
export const GetPOInfoBySupplier_api = async (
  supplierId,
  whId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPOInfoBySupplier?wareHouseId=${whId}&businessUnitId=${buId}&businessPartnerId=${supplierId}`
    );
    setLoading(false);
    if (res?.data?.length === 0) return toast.warn("Data not found");
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
export const getPurchaseOrganizationData = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemPurchaseInfo/GetPurchaseOrganizationDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) { }
};