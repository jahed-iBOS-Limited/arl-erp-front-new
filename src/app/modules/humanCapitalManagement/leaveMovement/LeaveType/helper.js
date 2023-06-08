import Axios from "axios";
import { toast } from "react-toastify";

export const editLeaveType = async (data,setDisabled) => {
    try {
      setDisabled && setDisabled(true)
      await Axios.put(`/hcm/YearlyLeaveConfig/EditLeaveType`, data);
      toast.success("Data successfully edited");
      setDisabled && setDisabled(false)
    } catch (error) {
      setDisabled && setDisabled(false)
      toast.warn(error?.response?.data?.message);
    }
  };

export const LeaveTypeGetById = async (leaveTypeId, setLoading, setter) => {
  try {
    // setLoading(true);
    const res = await Axios.get(
      `/hcm/YearlyLeaveConfig/GetLeaveTypeById?LeaveTypeId=${leaveTypeId}`
    );
    let {leaveTypeCode, leaveType, isPayable} = res?.data?.[0];
    let obj = {
      leaveTypeCode: leaveTypeCode,
      leaveType: leaveType,
      isPayable: isPayable
    };
    setter(obj);
    setLoading(false);
  } catch (error) {
    console.log("error", error);
  }
};

export const GetLeaveTypeLanding = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/hcm/YearlyLeaveConfig/GetLeaveTypeLanding?AccountId=${accId}&BusinesUnitId=${buId}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    console.log("error", error);
  }
};

export const createLeaveType = async (data, cb, setDisabled) => {
    
  try {
    setDisabled && setDisabled(true)
    await Axios.post(`/hcm/YearlyLeaveConfig/CreateLeaveType`, data);
    setDisabled && setDisabled(false)
    toast.success("Data successfully created");
    cb();
  } catch (error) {
    setDisabled && setDisabled(false)
    toast.warn(error?.response?.data?.message);
  }
};