import Axios from "axios";
import { toast } from "react-toastify";

export const saveApprovalSetup = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/domain/ApprovalConfig/CreateApprovalConfigure`,
      data
    );
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "save_approval_setup",
      });
      cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message, {
      toastId: "save_approval_setup_error",
    });
  }
};

export const editApprovalSetup = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/domain/ApprovalConfig/EditApprovalConfigure`,
      data
    );
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "edit_approval_setup",
      });
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.message || "Submitted successfully", {
      toastId: "edit_approval_setup_error",
    });
  }
};

export const getApprovalLandingDataAction = async (
  BuId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/domain/ApprovalConfig/GetApprovalConfigureByUnitIdLandingPagination?UnitId=${BuId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    
  }
};

export const getApprovalDataByIdAction = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/domain/ApprovalConfig/GetApprovalConfigureById?ConfigId=${id}`
    );
    if (res.status === 200) {
      const {
        predisorActivityId,
        predisorActivityName,
        tblApprovalConfigRow,
        isAnyOrder,
        isInSequence,
        approvalConfigId,
        groupName,
        anyUsers,
        plantId,
        plantName,
        moduleId,
        moduleName
      } = res?.data;
      const newData = {
        approvalConfigId,
        activityName: {
          value: predisorActivityId,
          label: predisorActivityName,
        },
        isThreshold: "",
        userName: "",
        groupName:groupName,
        any: { value: anyUsers, label: anyUsers },
        plant:{value:plantId,label:plantName},
        moduleName:{value: moduleId, label: moduleName},
        approvalOrder: isAnyOrder
          ? { value: "Any Order", label: "Any Order" }
          : isInSequence
          ? { value: "In Sequence", label: "In Sequence" }
          : { value: "Any Person", label: "Any Person" },
        row: tblApprovalConfigRow,
      };
      setter(newData);
    }
  } catch (error) {
    
  }
};

export const getActivityDDLByModule = async (mId, setter) => {
  try {
    const res = await Axios.get(
      //`/domain/Activity/GetActivityFeaturesList?moduleId=${mId}`
      `/domain/Activity/GetActivityFeaturesForApprovalSetup?moduleId=${mId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const approvalInActiveByConfigId = async (confId) => {
  try {
    const res = await Axios.post(
      `/domain/ApprovalConfig/ApprovalConfigInActive?ConfigId=${confId}`
    );
    if (res.status === 200 && res?.data) {
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "save_approval_setup",
      });
    }
  } catch (error) {}
};

export const getModuleDDL = async (accId, buId, setter) => {
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


export const getPantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};