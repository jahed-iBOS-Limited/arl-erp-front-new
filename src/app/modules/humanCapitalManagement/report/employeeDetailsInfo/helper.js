import axios from "axios";
import { toast } from "react-toastify";

export const getJobStations = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    const modifyData = res?.data?.map((item) => {
      return {
        ...item,
        value: item?.workplaceId,
        label: item?.workplaceName,
      };
    });
    setter(modifyData);
  } catch (error) {
    setter([]);
  }
};

export const getEmployeeDetailsReport = async (
  buId,
  email,
  jobStationId,
  typeId,
  setter,
  setLoading
) => {
  const Email = typeId === 1 ? `&email=${email}` : "";
  const JobID = typeId === 2 ? `&jobStationId=${jobStationId}` : "";
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/TMSReport/GetAttendanceInfo?businessUnitId=${buId}${Email}${JobID}&typeId=${typeId}`
    );
    if (res?.data?.length < 1) toast.warn("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getIndividualInfo = async (enrollId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/TMSReport/GetAttendanceInfoByEnrollId?enrollId=${enrollId}`
    );
    setter([res?.data]);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};
