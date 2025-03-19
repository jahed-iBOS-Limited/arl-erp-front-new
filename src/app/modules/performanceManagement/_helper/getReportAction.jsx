import axios from "axios";

export const getPmsReportAction = async (
  setter,
  buId,
  reportTypeRefId,
  yearId,
  fromMonth,
  toMonth,
  isDashboard,
  reportType,
  sectionId = 0
) => {
  try {
    const res = await axios.get(
      `/pms/Kpi2/GetKpiReportDynamic?intUnitID=${buId}&ReportTypeReffId=${reportTypeRefId}&intYearId=${yearId}&intFromMonthId=${fromMonth}&intToMonthId=${toMonth}&isDashBoard=${isDashboard}&ReportType=${reportType}&SectionId=${sectionId}`
    );
    setter(res?.data);
  } catch (error) {
    setter({});
  }
};

export const getUnapprovedPmsReportAction = async (
  setter,
  buId,
  reportTypeRefId,
  yearId,
  fromMonth,
  toMonth,
  isDashboard,
  reportType,
  setLoading
) => {
  try {
    setLoading && setLoading(true)
    const res = await axios.get(
      `/pms/Kpi2/GetNewKpiReportDynamic?intUnitID=${buId}&ReportTypeReffId=${reportTypeRefId}&intYearId=${yearId}&intFromMonthId=${fromMonth}&intToMonthId=${toMonth}&isDashBoard=${isDashboard}&ReportType=${reportType}`
    );
    setter(res?.data);
    setLoading && setLoading(false)
  } catch (error) {
    setLoading && setLoading(false)
    setter({});
  }
};
