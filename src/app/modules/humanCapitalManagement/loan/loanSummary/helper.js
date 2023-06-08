import axios from "axios";

export const getLoanSummaryReport = async (
  partId,
  empId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/HCMReport/EmployeeLoanReport?PartId=${partId}&EmployeeId=${empId}`
    );
    setter && setter(res?.data);
    setLoading(false);
    cb && cb(res?.data);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};
