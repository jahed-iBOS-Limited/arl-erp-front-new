import axios from "axios";

export const getWorkScheduleReport = async (
  buId,
  workPlaceId,
  setLoading,
  setter,
  empId = 0
) => {
  //  empId = 0 means all employee
  setLoading(true)
  try {
    const res = await axios.get(
      `/hcm/HCMWorkScheduleReport/GetWorkScheduleReport?BusinessUnitId=${buId}&WorkPlaceId=${workPlaceId}&EmployeeId=${empId}`
    );
    setLoading(false)
    setter(res?.data);
  } catch (error) {
    setLoading(false)
    setter([]);
  }
};
