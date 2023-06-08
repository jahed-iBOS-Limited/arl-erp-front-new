import Axios from "axios";
import { toast } from "react-toastify";

export const GetAllowForModificationLanding_api = async (
  buId,
  pageNo,
  pageSize,
  setter
) => {
  try {
    const res = await Axios.get(
      `/tms/AllowForModify/GetAllowForModificationLanding?BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getEmployeeDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const GetAllowForModificationById_api = async (
  id,
  setter,
  isDisabled
) => {
  try {
    isDisabled(true);
    const res = await Axios.get(
      `/tms/AllowForModify/GetAllowForModificationById?AutoId=${id}`
    );
    isDisabled(false);
    setter({
      ...res?.data,
      employeeName: res?.data?.enrol
        ? { value: res?.data?.enrol, label: res?.data?.employeeName }
        : "",
    });
  } catch (error) {
    isDisabled(false);
    setter([]);
  }
};
export const GetAllowModificationEmployeeInfo_api = async (
  empId,
  setValues,
  modifyValues
) => {
  try {
    const res = await Axios.get(
      `/tms/AllowForModify/GetAllowModificationEmployeeInfo?EmployeeId=${empId}`
    );
    setValues({
      ...res?.data,
      employeeName: modifyValues?.employeeName,
      isEditApiCall: true,
    });
  } catch (error) {
    setValues({
      ysnGhatInfo: false,
      ysnTransportZoneInfo: false,
      ysnItemInfo: false,
      employeeName: modifyValues?.employeeName,
      isEditApiCall: false,
    });
  }
};

// CreateAllowForModification
export const CreateAllowForModification = async (data, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/tms/AllowForModify/CreateAllowForModification`,
      data
    );
    toast.success(res?.message || "Submitted successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const EditAllowForModification_api = async (payload, setLoader) => {
  setLoader(false);
  try {
    const res = await Axios.put(
      `/tms/AllowForModify/EditAllowForModification`,
      payload
    );

    toast.success(res?.data?.message);
  } catch (error) {
    setLoader(false);
    toast.error(error?.response?.data?.message);
  }
};
