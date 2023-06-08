import axios from "axios";

export const getPerformanceDialogReport = async (
  reportTypeId,
  reportTypeName,
  yearId,
  quarterId,
  employeeId,
  buId,
  setLoading,
  setRowDto
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/pms/PerformanceMgmt/PerformanceDialogueReport?ReportTypeId=${reportTypeId}&ReportTypeName=${reportTypeName}&YearId=${yearId}&QuarterId=${quarterId}&EmployeeId=${employeeId}&BusinessUnitId=${buId}`
    );
    setLoading && setLoading(false);
    if (res?.data) {
      setRowDto && setRowDto(res?.data);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
