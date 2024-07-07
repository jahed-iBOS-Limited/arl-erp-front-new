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
  profitCenId,
  viewType,
  typeRef,
  subDivisionLabel
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/fino/IncomeStatement/GetIncomeStatementProjected?partName=${partName}&dteFromDate=${fromDate}&dteToDate=${toDate}&dteFromDateL=${fromDateL}&dteToDateL=${toDateL}&BusinessUnitGroup=${edLabel}&BusinessUnitId=${buId}&SBUID=${0}&intProfitCenId=${profitCenId ||
        0}&fsComponentId=0&GLId=0&SUBGLId=0&ConvertionRate=${conversionRate}&SubGroup=${subDivisionLabel ||
        "all"}&reportTypeId=${reportType}&ViewType=${viewType}&ViewTypeReff=${typeRef}`
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

export function isLastDayOfMonth(dateString) {
  if (!dateString) return false;
  // Parse the given date string to create a Date object
  const date = new Date(dateString);

  // Get the month and year of the given date
  const month = date.getMonth();
  const year = date.getFullYear();

  // Calculate the next day's date
  const nextDay = new Date(year, month, date.getDate() + 1);

  // If the next day is in a different month, it means the given date is the last day of the month
  return nextDay.getMonth() !== month;
}

export const projectedFinancialRatios = async ({
  values,
  selectedBusinessUnit,
  setFinancialRatioTable,
  setFinancialRatioComponentTable,
}) => {
  try {
    const fromDate = values?.fromDate ? new Date(values.fromDate) : new Date();
    const toDate = values?.toDate ? new Date(values.toDate) : new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    toDate.setFullYear(toDate.getFullYear() - 1);
    const fromDateStr = fromDate.toISOString().split("T")[0];
    const toDateStr = toDate.toISOString().split("T")[0];

    const financialRatioApi = await axios.get(
      `/fino/BudgetFinancial/GetFinancialRatioProjectd?BusinessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&Todate=${values?.toDate}&Type=2`
    );
    const financialRatioTableResponse = financialRatioApi.data;

    const financialRatioComponentApi = await axios.get(
      `/fino/BudgetFinancial/GetFinancialRatioProjectd?BusinessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&Todate=${values?.toDate}&Type=1`
    );
    const financialRatioTableForLastPeriodResponse =
      financialRatioComponentApi.data;

    const ratioMap = new Map();
    for (const item of financialRatioTableForLastPeriodResponse) {
      ratioMap.set(item.strRarioName, item.numRatio);
    }

    for (const item of financialRatioTableResponse) {
      const lastPeriodValue = ratioMap.get(item.strRarioName);
      item.lastPeriod =
        typeof lastPeriodValue === "number" ? lastPeriodValue : 0;
    }

    setFinancialRatioTable(financialRatioTableResponse);

    const componentResponse = await axios.get(
      `/fino/BudgetFinancial/GetFinancialRatioProjectd`,
      {
        params: {
          BusinessUnitId: values?.businessUnit?.value,
          FromDate: values?.fromDate,
          Todate: values?.toDate,
          Type: 1,
        },
      }
    );
    const financialRatioComponentTableResponse = componentResponse.data;

    const componentLastPeriodResponse = await axios.get(
      `/fino/CostSheet/GetFinancialRatio`,
      {
        params: {
          BusinessUnitId: values?.businessUnit?.value,
          FromDate: fromDateStr,
          Todate: toDateStr,
          Type: 1,
        },
      }
    );
    const financialRatioComponentTableForLastPeriodResponse =
      componentLastPeriodResponse.data;

    const componentMap = new Map();
    for (const item of financialRatioComponentTableForLastPeriodResponse) {
      componentMap.set(item.strComName, item.numAmount);
    }

    for (const item of financialRatioComponentTableResponse) {
      const lastPeriodValue = componentMap.get(item.strComName);
      item.numLastPeriod =
        typeof lastPeriodValue === "number" ? lastPeriodValue : item.numAmount;
    }

    setFinancialRatioComponentTable(financialRatioComponentTableResponse);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getReportId = (values) => {
  const typeId = values?.reportType?.value;
  const id = `40f2727f-155e-4e59-8cb4-225560f3173d`;
  const reportId = typeId === 2 ? id : "";
  return reportId;
};

export const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";

export const parameterValues = (values) => {
  const typeId = values?.reportType.value;

  const reportParameter = [
    { name: "strPartName", value: "IncomeStatement" },
    { name: "intUnit", value: values?.businessUnit?.value.toString() || "" },
    { name: "intSBUId", value: "0" },
    { name: "intProfitCenId", value: "0" },
    { name: "dteFromDate", value: values?.fromDate || "" },
    { name: "dteToDate", value: values?.toDate || "" },
    { name: "dteFromDateL", value: values?.toDate || "" },
    { name: "dteToDateL", value: values?.toDate || "" },
    { name: "intFSComponent", value: "0" },
    { name: "glId", value: "0" },
    { name: "subGlId", value: "0" },
    {
      name: "BusinessUnitGroup",
      value: values?.enterpriseDivision?.value?.toString() || "",
    },
    { name: "ConvertionRate", value: values?.conversionRate?.toString() || "" },
    { name: "SubGroup", value: values?.subDivision?.label.toString() || "all" },
    { name: "ReportTypeId", value: values?.reportType.value.toString() || "" },
    { name: "ViewTypeReff", value: "" },
  ];
  if (values?.viewType?.value) {
    reportParameter.push({ name: "ViewType", value: values.viewType.value });
  }
  const parameters = typeId === 2 ? reportParameter : [];
  return parameters;
};
