import axios from "axios";
import { toast } from "react-toastify";

// get selected business unit from store

export const getNewApplicationData = (
  MoveTypeId,
  EmployeeId,
  pageNo,
  pageSize,
  setter,
  setLoader
) => {
  setLoader(true);
  axios
    .get(
      `/hcm/OfficialMovement/OfficialMovementByMoveTypeIdLandingPasignation?MoveTypeId=${MoveTypeId}&EmployeeId=${EmployeeId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    )
    .then((res) => {
      const { data, status } = res;
      setLoader(false);
      if (status === 200 && data) {
        setter(data);
        setLoader(false);
      }
    });
};

export const approveSelected = async (payload, cb) => {
  try {
    const res = await axios.put(
      `/hcm/HCMLeaveAndMovementReport/GetOfficialMovement`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const movementApproveAction = async (
  ApplicationId,
  UserID,
  Approved,
  Rejected,
  cb
) => {
  try {
    const res = await axios.get(
      `/hcm/HCMLeaveAndMovementReport/GetOfficialMovement?ApplicationId=${ApplicationId}&UserID=${UserID}&Approved=${Approved}&Rejected=${Rejected}`
    );
    if (res.status === 200) {
      if (Approved === "true") {
        toast.success("movement approved successfully");
        cb();
      } else if (Rejected === "true") {
        toast.success("movement rejected successfully");
        cb();
      }
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
