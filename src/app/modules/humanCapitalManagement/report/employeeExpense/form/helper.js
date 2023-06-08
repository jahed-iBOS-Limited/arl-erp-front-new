import axios from "axios";

export const getEmployeeExpenseReport = async (
  buId,
  year,
  month,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/Report/GetEmployeeExpenseReport?businessUnitId=${buId}&year=${year}&month=${month}&isDownload=false`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
