import Axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from "../../../_helper/_todayDate";

export const getActivityDDL = async (mId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/Activity/GetActivityFeaturesList?moduleId=${mId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getModuleNameDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/CreateActivityGroup/GetModuleList?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.moduleName,
            value: item?.moduleId,
          };
        })
      );
    }
  } catch (error) {}
};

export const getGridData = async (
  buId,
  activityName,
  userId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/procurement/Approval/GetPurchaseOrderApprovalList?BusinessUnitId=${buId}&ActivityName=${activityName}&UserId=${userId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

// export const approvalApi = async (
//   ActivityId,
//   poId,
//   buId,
//   userId,
//   gridData,
//   setter
// ) => {
//   try {
//     const res = await Axios.put(
//       `/procurement/Approval/DynamicApproval?ActivityId=${ActivityId}&PoId=${poId}&BusinessUnitId=${buId}&UserId=${userId}`
//     );
//     alert("done")
//     if (res.status === 200) {
//       let approveData = gridData.filter((data) => data.transectionId !== poId);
//       setter(approveData);
//       toast.success("Approved successfully");
//       //cb()
//     }
//   } catch (error) {

//   }
// };

export const approvalApi = async (
  poayload,
  activityName,
  onChangeForActivity
) => {
  try {
    await Axios.put(`/procurement/Approval/DynamicApproval`, poayload);
    toast.success("Approved successfully");
    onChangeForActivity();
  } catch (error) {}
};

export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const BOMApprovalLanding = async (
  accId,
  buId,
  plantId,
  userId,
  pageNo,
  pageSize,
  setLoading,
  setter,
  search
) => {
  setLoading(true);
  try {
    let searchTerm = search ? `searchTerm=${search}&` : "";
    let url = `/mes/BOM/BOMApprovalLanding?${searchTerm}accountId=${accId}&businessUnitId=${buId}&plantId=${plantId}&userId=${userId}&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}`;
    const res = await Axios.get(url);
    setLoading(false);

    const modifiedData = {
      data: res?.data?.data?.map((itm) => ({
        ...itm,
        isSelected: false,
      })),
      totalCount: res?.data?.totalCount,
      currentPage: res?.data?.currentPage,
      pageSize: res?.data?.pageSize,
    };
    setter(modifiedData);
  } catch (error) {
    setLoading(false);
    console.log(error?.response?.data?.message);
  }
};

export const CostForBOMLanding = async (
  accId,
  buId,
  shopFloorId,
  itemId,
  approveQty,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/mes/BOM/CostForBOM?accountId=${accId}&businessUnitId=${buId}&shopFloorId=${shopFloorId}&itemId=${itemId}&approveQty=${approveQty}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};
export const getBomTotalCost = async (
  buId,
  itemId,
  bomId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/mes/BOM/ItemCostWithOverhead?businessUnitId=${buId}&itemId=${itemId}&bomId=${bomId ||
        0}&getdate=${_todayDate()}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    setLoading(false);
  }
};

export const saveBOMApproval_api = async (
  poayload,
  commonBillOfMaterialGridFunc
) => {
  try {
    await Axios.put(`/mes/BOM/BOMApproval`, poayload);
    toast.success("Approved successfully");
    commonBillOfMaterialGridFunc();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
