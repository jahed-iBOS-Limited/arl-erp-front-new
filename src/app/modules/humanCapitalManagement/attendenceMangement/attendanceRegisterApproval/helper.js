import axios from "axios";
import { toast } from "react-toastify";

export const getNewApplicationData = (
  accId,
  buId,
  status,
  pageNo,
  pageSize,
  setter,
  setLoader
) => {
  setLoader(true);
  axios
    .get(
      `/hcm/EmployeeRemoteAttendance/GetAttendenceRegistrationLanding?accountId=${accId}&businessUnitid=${buId}&status=${status}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    )
    .then((res) => {
      const newData = res?.data?.data?.map((item) => ({
        ...item,
        isSelect: false,
      }));
      setter({ ...res?.data, data: newData });
      setLoader(false);
    })
    .catch((err) => {
      setter({ data: [] });
      setLoader(false);
    });
};

export const approveAll = async (payload, setLoader, cb) => {
  setLoader(false);
  try {
    const res = await axios.put(
      `/hcm/EmployeeRemoteAttendance/ApproveEmployee`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message, { toastId: "dfghj" });
      cb();
    }
  } catch (error) {
    setLoader(false);
    toast.error(error?.response?.data?.message, { toastId: "dfghjk" });
  }
};
