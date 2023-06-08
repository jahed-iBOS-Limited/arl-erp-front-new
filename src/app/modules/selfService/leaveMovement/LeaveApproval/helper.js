import axios from "axios";
import { toast } from "react-toastify";

export const getWorkplaceGroupDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${accId}`
    );
    const data = [...res?.data];
    data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getLeaveTypeDDL = async (checkId, accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetLeaveTypeDDL?check=${checkId}&accountId=${accId}`
    );
    const data = [{ value: 0, label: "All" }, ...res?.data];
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getNewApplicationData = (
  buId,
  workPlaceIdpId,
  plChangeStatus = false,
  leaveTypeId,
  adminTypeId,
  viewTypeId,
  employeeId,
  setter,
  setLoader
) => {
  setLoader(true);

  let isForPLChange = plChangeStatus ? `&isForPLChange=true` : "";

  let API = `/hcm/HCMLeaveApplication/GetLeaveApplicationListForApprove?businessUnitId=${buId}&WorkPlaceGroupId=${workPlaceIdpId}&adminTypeId=${adminTypeId}&viewTypeId=${viewTypeId}&employeeId=${employeeId}&leaveTypeId=${leaveTypeId}${isForPLChange}`;

  // let API = `/hcm/HCMLeaveApplication/GetLeaveApplicationListForApprove?adminTypeId=${adminTypeId}&viewTypeId=${viewTypeId}&employeeId=${employeeId}&leaveTypeId=${leaveTypeId}${isForPLChange}`;

  axios
    .get(API)
    .then((res) => {
      const { data } = res;
      const newData = data?.map((item) => ({ ...item, isSelect: false }));
      setter(newData);
      setLoader(false);
    })
    .catch((err) => {
      setter([]);
      setLoader(false);
    });
};

export const approveAll = async (payload, setLoader, cb) => {
  setLoader(false);
  try {
    const res = await axios.put(
      `/hcm/HCMLeaveAndMovementReport/LeaveApplicationApproved`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data);
      cb();
    }
  } catch (error) {
    setLoader(false);
    toast.error(error?.response?.data?.message);
  }
};

export const approveLeavePLForchangeReq = async (payload, setLoader, cb) => {
  setLoader(true);
  try {
    const res = await axios.post(
      `/hcm/HCMLeaveApplication/PLChangeRequest`,
      payload
    );
    cb();
    toast.success(res.data?.message || "Approved successfully");
    setLoader(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Please try again");
    setLoader(false);
  }
};
