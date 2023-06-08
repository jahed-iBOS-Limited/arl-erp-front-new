// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";

export const getPermissionTypeDDL = async (setter, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/domain/CreateRoleManager/GetActivityPermissionTypeList`
    );
    if (res?.status === 200) {
      let paylaod = res?.data?.map((item) => {
        return {
          ...item,
          value: item?.activityPermissionTypeId,
          label: item?.activityPermissionTypeName,
        };
      });
      setter(paylaod);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const getUserDDL = async (accId, buId, setter, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/domain/CreateUser/GetUserDDL?AccountId=${accId}&UnitId=${buId}`
    );
    if (res?.status === 200) {
      let paylaod = res?.data;
      setter(paylaod);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const getUserGroupDDL = async (accId, setter, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/domain/CreateUserGroup/GetUserGroupHeaderDDL?AccountId=${accId}`
    );
    if (res?.status === 200) {
      let paylaod = res?.data?.map((item) => {
        return {
          ...item,
          label: item?.userGroupName,
          value: item?.userGroupId,
        };
      });
      setter(paylaod);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const getModuleNameDDL = async (setter, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.get(`/domain/FeatureGroup/GetModuleList`);
    if (res?.status === 200) {
      let paylaod = res?.data?.map((item) => {
        return {
          ...item,
          label: item?.moduleName,
          value: item?.moduleId,
        };
      });
      setter(paylaod);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const getFeatureDDL = async (mId, setter, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/domain/FeatureGroup/GetModuleFeature?ModuleId=${mId}`
    );
    if (res?.status === 200) {
      let paylaod = res?.data?.map((item) => {
        return {
          ...item,
          label: item?.featureName,
          value: item?.featureId,
        };
      });
      setter(paylaod);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const getFeatureGroupDDL = async (accId, mId, setter, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/domain/FeatureGroup/GetFeatureGroupDDL?AccountId=${accId}&ModuleId=${mId}`
    );
    if (res?.status === 200) {
      let paylaod = res?.data;
      setter(paylaod);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

// This is Work for ddl and grid data also
export const getModuleFeature = async (moduleId, setter, type, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/domain/FeatureGroup/GetModuleFeature?ModuleId=${moduleId}`
    );
    if (res?.status === 200) {
      let payload = res?.data?.map((item) => {
        return {
          // value and label for DDL
          value: item?.featureId,
          label: item?.featureName,
          moduleId: item?.moduleId,
          moduleCode: item?.moduleCode,
          moduleName: item?.moduleName,
          featureId: item?.featureId,
          featureCode: item?.featureCode,
          featureName: item?.featureName,
          isActive: item?.isActive,
          isCreate: type ? item?.isCreate : false,
          isEdit: type ? item?.isEdit : false,
          isView: type ? item?.isView : false,
          isClose: type ? item?.isClose : false,
        };
      });
      setter(payload);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const getLandingData = async (
  accId,
  setDisabled,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setDisabled(true);
  const searchPath = search ? `Search=${search}&` : "";
  try {
    let res = await axios.get(
      `/domain/CreateRoleManager/GetRoleManagerSearchLandingPasignation?${searchPath}AccountId=${accId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const createRoleManager = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    let res = await axios.post(
      `/domain/CreateRoleManager/CreateUserRoleManager`,
      payload
    );
    if (res?.status === 200) {
      console.log("Success Data", res?.data);
      toast.success("Submit Successfully", { toastId: "createRoleManager" });
      setDisabled(false);
      cb();
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "createRoleManagerError",
    });
    setDisabled(false);
  }
};

export const editRoleManager = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.put(
      `/domain/CreateRoleManager/EditUserRoleManager`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "editRoleManager" });
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "editRoleManagerError",
    });
    setDisabled(false);
  }
};

export const getRoleManagerById = async (
  id,
  setDisabled,
  setter,
  setRowData,
  setPermissionType
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/domain/CreateRoleManager/GetRoleManagerById?userId=${id}`
    );
    if (res?.status === 200) {
      setDisabled(false);
      setPermissionType(res?.data?.objHeader[0]?.activityPermissionTypeId);
      const payload = {
        permissionType: {
          value: res?.data?.objHeader[0]?.activityPermissionTypeId,
          label: res?.data?.objHeader[0]?.activityPermissionTypeName,
        },
        user: {
          value: res?.data?.objHeader[0]?.userReferenceId,
          label: res?.data?.objHeader[0]?.userReferenceName,
        },
        userGroup: {
          value: res?.data?.objHeader[0]?.userReferenceId,
          label: res?.data?.objHeader[0]?.userReferenceName,
        },
        module: {
          value: res?.data?.objHeader[0]?.moduleId,
          label: res?.data?.objHeader[0]?.moduleName,
        },
        feature: "",
        featureGroup: {
          value: res?.data?.objHeader[0]?.featureReferenceId,
          label: res?.data?.objHeader[0]?.featureReferenceName,
        },
      };
      if (
        res?.data?.objHeader[0]?.activityPermissionTypeId === 2 ||
        res?.data?.objHeader[0]?.activityPermissionTypeId === 4
      ) {
        setter({
          ...payload,
          userPermissionId: res?.data?.objHeader[0]?.userPermissionId,
        });
      } else {
        setter(payload);
        setRowData(
          res?.data?.objHeader?.map((item) => {
            return {
              ...item,
              isSelect: item?.isCreate || item?.isEdit || item?.isView || false,
            };
          })
        );
        
      }
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
