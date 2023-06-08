import Axios from "axios";

export const getCustomerBankGuaranteeReport = async (
  accId,
  buId,
  channelId,
  date,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/OMSPivotReport/GetCustomerBankGuaranteeReport?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&Date=${date}`
    );
    if (res?.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
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

