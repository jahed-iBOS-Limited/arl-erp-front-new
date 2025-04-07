import axios from 'axios';
import { toast } from 'react-toastify';

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
      `/hcm/HCMOvertimeRequisition/GetOvertimeListForApprove?adminTypeId=${adminTypeId}&viewTypeId=${viewTypeId}&employeeId=${employeeId}&workplaceId=${workplaceId}&fromDate=${fromDate}&todate=${toDate}`
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
    const res = await axios.put(
      `/hcm/HCMOvertimeRequisition/OvertimeRequisitionApprove`,
      payload
    );
    setLoader(false);
    // res?.data means success message
    toast.success(res?.data || 'Success');
    cb();
  } catch (error) {
    setLoader(false);
    toast.error(error?.response?.data?.message || 'Something went wrong');
  }
};
