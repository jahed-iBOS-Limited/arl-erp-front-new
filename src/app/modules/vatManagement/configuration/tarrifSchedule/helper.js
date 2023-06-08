import axios from "axios";

export const getTarrifScheduleData = async (
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
      `/vat/TaxItemGroup/GetTarifScheduleSearchPagination?ScheduleType=${scheduleType}&year=${year}&SearchTerm=${search}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
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
