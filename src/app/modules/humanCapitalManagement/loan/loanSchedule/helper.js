import axios from "axios";


// 
export const getLoanScheduleReport = async (
  employeeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/HCMReport/EmployeeLoanReport?PartId=1&EmployeeId=${employeeId}`
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

// get Employee Information
export const getEmployeeInfo = async (employeeId, setter, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/HCMReport/EmployeeLoanReport?PartId=3&EmployeeId=${employeeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      cb && cb(res?.data);
      setLoading(false);
    }
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};