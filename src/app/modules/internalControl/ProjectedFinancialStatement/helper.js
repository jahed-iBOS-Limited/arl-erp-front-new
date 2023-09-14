import axios from "axios";

export const getProfitCenterDDL = async (buId, setter) => {
  try {
    const res = await axios.get(`/fino/CostSheet/ProfitCenterDDL?BUId=${buId}`);
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
  reportType,
  profitCenId
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/IncomeStatement/GetIncomeStatementProjected?partName=${partName}&dteFromDate=${fromDate}&dteToDate=${toDate}&dteFromDateL=${fromDateL}&dteToDateL=${toDateL}&BusinessUnitGroup=${edLabel}&BusinessUnitId=${buId}&SBUID=${
        0}&intProfitCenId=${profitCenId ||
        0}&fsComponentId=0&GLId=0&SUBGLId=0&ConvertionRate=${conversionRate}&SubGroup=all&reportTypeId=${reportType}`
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

export const manageBalanceData = (arr) => {
  var currentassets = [],
    currentassetsTotalBalance = 0,
    currentassetsTotalPlanBalance = 0,
    nonCurrentAssets = [],
    nonCurrentAssetsTotalBalance = 0,
    nonCurrentAssetsTotalPlanBalance = 0,
    equity = [],
    equityTotalBalance = 0,
    equityTotalPlanBalance = 0,
    nonCurrentLiability = [],
    nonCurrentLiabilityTotalBalance = 0,
    nonCurrentLiabilityTotalPlanBalance = 0,
    currentLiability = [],
    currentLiabilityTotalBalance = 0,
    currentLiabilityTotalPlanBalance = 0;

  arr.forEach((data) => {
    if (data.strAcClassName === "Current Asset") {
      currentassetsTotalBalance = currentassetsTotalBalance + data.numBalance;
      currentassetsTotalPlanBalance =
        currentassetsTotalPlanBalance + data.numPlanBalance;
      currentassets.push(data);
    } else if (data.strAcClassName === "Non Current Asset") {
      nonCurrentAssetsTotalBalance =
        nonCurrentAssetsTotalBalance + data.numBalance;
      nonCurrentAssetsTotalPlanBalance =
        nonCurrentAssetsTotalPlanBalance + data.numPlanBalance;
      nonCurrentAssets.push(data);
    } else if (data.strAcClassName === "Equity") {
      equityTotalBalance = equityTotalBalance + data.numBalance;
      equityTotalPlanBalance = equityTotalPlanBalance + data.numPlanBalance;
      equity.push(data);
    } else if (data.strAcClassName === "Non Current Liabilities") {
      nonCurrentLiabilityTotalBalance =
        nonCurrentLiabilityTotalBalance + data.numBalance;
      nonCurrentLiabilityTotalPlanBalance =
        nonCurrentLiabilityTotalPlanBalance + data.numPlanBalance;
      nonCurrentLiability.push(data);
    } else if (data.strAcClassName === "Current Liabilities") {
      currentLiabilityTotalBalance =
        currentLiabilityTotalBalance + data.numBalance;
      currentLiabilityTotalPlanBalance =
        currentLiabilityTotalPlanBalance + data.numPlanBalance;
      currentLiability.push(data);
    }
  });

  return {
    currentassets: currentassets,
    nonCurrentAssets: nonCurrentAssets,
    currentassetsTotalBalance: currentassetsTotalBalance,
    currentassetsTotalPlanBalance: currentassetsTotalPlanBalance,
    nonCurrentAssetsTotalBalance: nonCurrentAssetsTotalBalance,
    nonCurrentAssetsTotalPlanBalance: nonCurrentAssetsTotalPlanBalance,
    equity: equity,
    equityTotalBalance: equityTotalBalance,
    equityTotalPlanBalance: equityTotalPlanBalance,
    nonCurrentLiability: nonCurrentLiability,
    nonCurrentLiabilityTotalBalance: nonCurrentLiabilityTotalBalance,
    nonCurrentLiabilityTotalPlanBalance: nonCurrentLiabilityTotalPlanBalance,
    currentLiability: currentLiability,
    currentLiabilityTotalBalance: currentLiabilityTotalBalance,
    currentLiabilityTotalPlanBalance: currentLiabilityTotalPlanBalance,
  };
};
