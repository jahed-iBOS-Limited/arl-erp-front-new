import axios from "axios";
import { toast } from "react-toastify";

export const getNewApplicationData = async (
  adminTypeId,
  viewTypeId,
  employeeId,
  workplaceId,
  fromDate,
  toDate,
  setter,
  setLoader
) => {
  try {
    setLoader(true);
    const res = await axios.get(
      `/hcm/HCMOverTime/GetOvertimeEntryListForApprove?adminTypeId=${adminTypeId}&viewTypeId=${viewTypeId}&employeeId=${employeeId}&workplaceId=${workplaceId}&fromDate=${fromDate}&todate=${toDate}`
    );
    setLoader(false);
    const newData = res?.data?.map((item) => ({ ...item, isSelect: false }));
    setter(newData);
  } catch (error) {
    setter([]);
    setLoader(false);
  }
};

export const approveAll = async (payload, setLoader, cb) => {
  try {
    setLoader(true);
    const res = await axios.put(`/hcm/HCMOverTime/OvertimeEntryApprove`, payload);
    setLoader(false);
    // res?.data means success message
    toast.success(res?.data || "Success");
    cb();
  } catch (error) {
    setLoader(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};


export const getWorkplaceDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    const modfid = res?.data?.map((item) => ({
      value: item?.workplaceId,
      label: item?.workplaceName,
      code: item?.workplaceCode,
      workplaceGroupId: item?.workplaceGroupId,
    }));
    const newModfData = [{ value: 0, label: "All"}, ...modfid]
    setter(newModfData);
  } catch (error) {
    setter([]);
  }
};