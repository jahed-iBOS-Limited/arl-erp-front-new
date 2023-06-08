import axios from "axios";

export const getOvertimeReport = async (
  buId,
  workPlaceId,
  fromDate,
  toDate,
  setter,
  setLoading,
  viewTypeId,
  adminTypeId,
  employeeId
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/hcm/HCMOverTime/GetOverTimeReport?BusinessUnitId=${buId}&WorkPlaceId=${workPlaceId}&FromDate=${fromDate}&ToDate=${toDate}&EmployeeId=0&AdminTypeId=${adminTypeId}&ViewTypeId=${viewTypeId}&AdminEmployeeId=${employeeId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getOverTimeDetailsById = async (
  empId,
  buId,
  workPlaceId,
  fromDate,
  toDate,
  setter,
  setLoading,
  viewTypeId,
  adminTypeId
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/HCMOverTime/GetOverTimeReport?BusinessUnitId=${buId}&WorkPlaceId=${workPlaceId}&FromDate=${fromDate}&ToDate=${toDate}&EmployeeId=${empId}&AdminTypeId=${adminTypeId}&ViewTypeId=${viewTypeId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
