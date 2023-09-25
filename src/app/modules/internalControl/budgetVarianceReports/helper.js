import { default as Axios, default as axios } from "axios";
export const getBusinessDDLByED = async (
    accId,
    enterpriseDivisionLabel,
    setter,
    subDivision
  ) => {
    try {
      const res = await Axios.get(
        `/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${accId}&BusinessUnitGroup=${enterpriseDivisionLabel}${subDivision ? `&SubGroup=${subDivision?.value}`:""}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {}
  };

  export const getProfitCenterDDL = async (buId, setter) => {
    try {
      const res = await axios.get(
        `/fino/CostSheet/ProfitCenterDDL?BUId=${buId}`
      );
      if (res.status === 200 && res?.data) {
        const DDLData = [{ value: 0, label: "All" }, ...res?.data];
        setter(DDLData);
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
    reportType
  ) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/fino/IncomeStatement/GetIncomeStatement?partName=${partName}&dteFromDate=${fromDate}&dteToDate=${toDate}&dteFromDateL=${fromDateL}&dteToDateL=${toDateL}&BusinessUnitGroup=${edLabel}&BusinessUnitId=${buId}&SBUID=${sbuId ||
          0}&intProfitCenId=${profitCenter?.value ||
          0}&ConvertionRate=${conversionRate}&SubGroup=${subDivision?.value || 0}&reportTypeId=${reportType}`
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