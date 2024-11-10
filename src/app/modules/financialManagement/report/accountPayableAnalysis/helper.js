import axios from "axios";
import { toast } from "react-toastify";

export const getAccountPayableAnalysisData = async (
  accId,
  buId,
  reportDate,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/BalanceSheet/GetAccountsReceivableAgingReport?AccountId=${accId}&BusinessUnitId=${buId}&ReportDate=${reportDate}&ChannelId=0&ReportType=2`
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
