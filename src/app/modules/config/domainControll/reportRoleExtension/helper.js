import Axios from "axios";

export const getPermissionForAccountById = async (
  accountId,
  businessUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/domain/Reports/GetPermissionForAccountById?AccountId=${accountId}&BranchId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getAllMenuDetails = async (setter) => {
  try {
    const res = await Axios.get(
      `/domain/Reports/GetAllMenuDetails
      `
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        label: item?.strLabel,
        value: item?.intFirstLabelId,
      }))
    );
  } catch (error) {
    setter([]);
  }
};

export const getAllSecondLevelMenu = async (moduleId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/Reports/GetAllSecondLevelMenu?FirstLevelId=${moduleId}
      `
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        label: item?.strLabel,
        value: item?.intSecondLabelId,
      }))
    );
  } catch (error) {
    setter([]);
  }
};

export const getPermissionForUserById = async (userId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/Reports/GetPermissionForUserById?UserId=${userId}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        label: item?.strLabel,
        value: item?.intSecondLabelId,
      }))
    );
  } catch (error) {
    setter([]);
  }
};

export const postPermissionForUser = async (payload, setDisabled, cb) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/domain/Reports/PostPermissionForUser`,
      payload
    );
    cb(
      res?.data?.map((item) => ({
        ...item,
        label: item?.strLabel,
        value: item?.intSecondLabelId,
      }))
    );
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    cb([]);
  }
};
