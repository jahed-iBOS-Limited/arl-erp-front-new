import axios from "axios";
import { toast } from "react-toastify";

export const getAccRcvAnalysisLandingData = async (
  accId,
  buId,
  channelId,
  reportDate,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/BalanceSheet/GetAccountsReceivableAgingReport?AccountId=${accId}&BusinessUnitId=${buId}&ReportDate=${reportDate}&ChannelId=${channelId}&ReportType=1`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
    setter([]);
  }
};

export const getDistributionChannels = async (
  accId,
  buId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
