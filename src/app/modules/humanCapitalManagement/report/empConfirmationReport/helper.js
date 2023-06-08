import Axios from "axios";

export const getEmployeeJoiningConfirmationReport = async (partId, fromDate, toDate, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/hcm/HCMReport/EmployeeJoiningConfirmationReport?partId=${partId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};