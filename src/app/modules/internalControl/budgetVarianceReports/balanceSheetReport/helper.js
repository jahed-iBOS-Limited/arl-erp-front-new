import Axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getBusinessUnitDDL = async (setter, accountId) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      const modifyResData = [{ value: 0, label: "All" }, ...res?.data];
      setter(modifyResData);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const GetCustomerNameDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

const manageBalanceData = (arr) => {
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

export const getReportBalance = async (
  accId,
  buId,
  date,
  setter,
  setLoading,
  enterpriseDivision = "",
  ConvertionRate,
  forecastType = 0,
  setIsTableShow
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/BalanceSheet/GetBalanceSheet?AccountId=${accId}&BusinessUnitGroup=${enterpriseDivision ||
        ""}&BusinessUnitId=${buId}&AsOnDate=${_dateFormatter(
        date
      )}&ConvertionRate=${ConvertionRate}&isForecast=${forecastType}`
    );

    if (res.status === 200 && res?.data) {
      const bananceData = await manageBalanceData(res?.data);
      setter(bananceData);
      setLoading(false);
      setIsTableShow(true);
    }
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
