import Axios from "axios";

export const getUserLoginInfo = async (accId, buId, empId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    cb(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};


