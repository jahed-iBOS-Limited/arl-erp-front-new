import axios from "axios";
import { toast } from "react-toastify";

export const getGrowCoachingModelWorksheet = async (
  employeeId,
  yearId,
  quarterId,
  setLoading,
  setRowDto
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/pms/PerformanceMgmt/GetGrowModel?YearId=${yearId}&QuarterId=${quarterId}&EmployeeId=${employeeId}`
    );
    setLoading && setLoading(false);

    if (res?.data) {
      setRowDto && setRowDto(res?.data);
    } else {
      setRowDto && setRowDto(null);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createGrowModel = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/pms/PerformanceMgmt/GrowModelCreateAndEdit`,
      payload
    );
    toast.success(res?.data?.message, { toastId: "createGrowModel" });
    setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "createGrowModelError",
    });
    setLoading(false);
  }
};
