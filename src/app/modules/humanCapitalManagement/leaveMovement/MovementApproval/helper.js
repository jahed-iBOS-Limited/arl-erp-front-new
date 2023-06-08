import axios from "axios";
import { toast } from "react-toastify";

// get selected business unit from store

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

export const getNewApplicationData = (
  buId,
  workPlaceId,
  adminTypeId,
  viewTypeId,
  employeeId,
  setter,
  setLoader
) => {
  setLoader(true);
  axios
    .get(
      `/hcm/HCMMovementApplication/GetMovementApplicationListForApprove?businessUnitId=${buId}&WorkPlaceGroupId=${workPlaceId}&adminTypeId=${adminTypeId}&viewTypeId=${viewTypeId}&employeeId=${employeeId}`
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
      `/hcm/HCMLeaveAndMovementReport/ApproveMovementApplication`,
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
