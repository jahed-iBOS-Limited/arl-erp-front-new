import axios from "axios";
import { toast } from "react-toastify";

export const getTafsilData = async (
  scheduleType,
  year,
  pageNo,
  pageSize,
  setLoading,
  setter,
  searchTerm
) => {
  setLoading(true);
  try {
    const search = searchTerm ? searchTerm : "";
    const res = await axios.get(
      `/vat/TaxItemGroup/GetTafsilSearchPagination?ScheduleType=${scheduleType}&year=${year}&SearchTerm=${search}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
    );

    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getScheduleTypeDDL = async (setter) => {
  try {
    const res = await axios.get("/vat/TaxItemGroup/GetScheduleTypeDDL");
    setter(res?.data);
  } catch (error) {}
};

export const getFiscalYearDDL = async (setter) => {
  try {
    const res = await axios.get("/vat/TaxDDL/FiscalYearDDL");
    const modifyData = res?.data?.filter((item) => item?.value !== 2020);
    setter(modifyData);
  } catch (error) {
    setter([]);
  }
};
