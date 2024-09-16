import Axios from "axios";

export const getProfitCenterDDL = async (buId, setter) => {
  try {
    const res = await Axios.get(`/fino/CostSheet/ProfitCenterDDL?BUId=${buId}`);
    if (res.status === 200 && res?.data) {
      const DDLData = [{ value: 0, label: "All" }, ...res?.data];
      setter(DDLData);
    }
  } catch (error) {}
};

export const getEnterpriseDivisionDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBusinessUnitGroupByAccountDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBusinessDDLByED = async (
  accId,
  enterpriseDivisionLabel,
  setter,
  subDivision
) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${accId}&BusinessUnitGroup=${enterpriseDivisionLabel}${
        subDivision ? `&SubGroup=${subDivision?.value}` : ""
      }`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getIncomeStatement_api = async (
  fromDate,
  toDate,
  fromDateL,
  toDateL,
  buId,
  sbuId,
  setter,
  profitCenter,
  setLoading = () => {},
  partName = "",
  edLabel = "",
  conversionRate,
  subDivision,
  reportType,
  forecastType = 0
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/IncomeStatement/GetIncomeStatement?partName=${partName}&dteFromDate=${fromDate}&dteToDate=${toDate}&dteFromDateL=${fromDateL}&dteToDateL=${toDateL}&BusinessUnitGroup=${edLabel}&BusinessUnitId=${buId}&SBUID=${sbuId ||
        0}&intProfitCenId=${profitCenter?.value ||
        0}&ConvertionRate=${conversionRate}&SubGroup=${subDivision?.value ||
        0}&reportTypeId=${reportType}&isForecast=${forecastType}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getAdjustmentJournalView = async (
  adId,
  typeId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/AdjustmentJournal/GetAdjustmentJournalByIdForReportForIncomeStatement?adjustmentJournalId=${adId}&accountingJournalTypeId=${typeId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && Array.isArray(res?.data)) {
      setLoading(false);
      const data = res?.data?.[0];
      setter(data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getBankJournalView = async (
  bjId,
  hdId,
  buId,
  setter,
  setLoading,
  headerData
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/CommonFino/${
        headerData?.fromWhere === "incomeStatement"
          ? `GetBankJournalReportForIncomeStatement`
          : `GetBankJournalReport`
      }?JournalId=${bjId}&AccountingJournalTypeId=${hdId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getCashJournalView = async (
  cjId,
  hdId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/CommonFino/GetJournalViewReportForIncomeStatement?JournalId=${cjId}&AccountingJournalTypeId=${hdId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};
