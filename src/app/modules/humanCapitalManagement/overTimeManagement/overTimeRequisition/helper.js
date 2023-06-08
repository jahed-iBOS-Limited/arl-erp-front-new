import axios from "axios";
import { toast } from "react-toastify";

export const loadUserListAction = (accId, buId, searchValue) => {
  if (searchValue?.length < 2) return [];
  return axios
    .get(
      `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${accId}&BusinessUnitId=${buId}&Search=${searchValue}`
    )
    .then((res) => {
      return res?.data;
    })
    .catch((err) => []);
};

export const saveOvertimeReqAction = async (
  profileData,
  buId,
  rowDto,
  setRowDto,
  cb
) => {
  try {
    const payload = rowDto?.map((item) => ({
      intAccountId: profileData?.accountId,
      intBusinessUnitId: buId,
      intRequestedDepartmentId: item?.reqDepartment?.value,
      intCostCenterId: item?.costCenter?.value || 0,
      intWorkPlaceId: item?.workplace?.value,
      dteRequestedDate: item?.reqDate,
      intEmployeeId: item?.employee?.value,
      strEmployeeName: item?.employee?.label,
      strReasonForOvertime: item?.reason,
      intCurrentShiftId: item?.employee?.employeeCalenderId || 0,
      strCurrentShiftName: item?.employee?.employeeCalenderName || "",
      intRequestedOtShiftId: item?.reqOtShift?.value,
      strRequestedOtShiftName: item?.reqOtShift?.label,
      strHoursMinute: `${item?.hour}:${
        item?.minutes.toString().length === 1 ? "0" : ""
      }${item?.minutes || "0"}`,
      intActionBy: profileData?.userId,
    }));
    const res = await axios.post(
      `/hcm/HCMOvertimeRequisition/CreateOvertimeRequisition`,
      payload
    );
    cb();
    setRowDto([]);
    toast.success(res?.data?.message || "Save successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const getOvertimeReqLandingAction = async (
  accId,
  buId,
  setter,
  setLoading,
  date
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/hcm/HCMOvertimeRequisition/GetOvertimeRequisitionLanding?AccountId=${accId}&BusinessUnitId=${buId}&Date=${date}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getDepartmentDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAcIdBuIdDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const removeOvertimeReqByIdAction = async (id, cb) => {
  try {
    const res = await axios.put(
      `/hcm/HCMOvertimeRequisition/DeleteOvertimeRequisition?autoId=${id}`
    );
    cb();
    toast.success(res?.data?.message || "Deleted successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Try again");
  }
};

export const getWorkplaceDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    const newData = res?.data?.map((item) => ({
      ...item,
      value: item?.workplaceId,
      label: item?.workplaceName,
    }));
    setter(newData);
  } catch (error) {
    setter([]);
  }
};

export const getCostCenterDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetCostCenterWithAccBuDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getOtShiftDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetCalenderDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
