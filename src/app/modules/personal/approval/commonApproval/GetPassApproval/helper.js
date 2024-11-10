import axios from "axios";
import { toast } from "react-toastify";

// get selected business unit from store

export const getNewApplicationData = (
  userId,
  applicationTypeNumber,
  pageNo,
  pageSize,
  setter,
  setLoader
) => {
  setLoader(true);
  axios
    .get(
      `/hcm/LeaveApplication/LeaveApplicationByEmployeeIdLandingPasignation?EmployeeId=${userId}&LeaveTypeId=${applicationTypeNumber}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    )
    .then((res) => {
      const { data, status } = res;
      if (status === 200 && data) {
        setter(data);
        setLoader(false);
      }
    });
};

export const approveAll = async (payload, setLoader, cb) => {
  setLoader(true);
  try {
    const res = await axios.put(
      `/hcm/HCMLeaveAndMovementReport/LeaveApplicationApproved`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
      setLoader(false);
      cb();
    }
  } catch (error) {
    setLoader(false);
    toast.error(error?.response?.data?.message);
  }
};
