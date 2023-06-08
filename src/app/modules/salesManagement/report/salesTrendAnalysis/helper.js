import Axios from "axios";

export const getSalesTrendAnalysisApi = async (
  topSheetId,
  buId,
  chId,
  totalDay,
  runningDay,
  fromDate,
  toDate,
  setLoading,
  setter,
  empId,
  RATId,
  levelId
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/SalesInformation/GetSalesTrendAnalysis?Partid=${topSheetId}&UnitID=${buId}&FromDateDaySales=${fromDate}&ToDateDaySales=${toDate}&TotalDay=${totalDay}&RunningThDay=${runningDay}&Channelid=${chId}&Employeeid=${empId ||
        0}&RATId=${RATId || 0}&LevelId=${levelId || 0}`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};
