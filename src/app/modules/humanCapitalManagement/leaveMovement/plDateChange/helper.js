import Axios from "axios";
import { toast } from "react-toastify";

export const getPlApplicationList = async (buId, empId, setLoading, setter) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/hcm/LeaveAndMovement/GetPLApplicationList?businessUnitId=${buId}&EmployeeId=${empId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const savePlDateChangeAction = async (setLoading, data, cb) => {
  try {
    setLoading(true);
    const res = await Axios.post(
      `/hcm/HCMLeaveApplication/ChangePLDateByAdmin`,
      data
    );
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading(false);
    cb()
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Failed , try again");
    setLoading(false);
  }
};
