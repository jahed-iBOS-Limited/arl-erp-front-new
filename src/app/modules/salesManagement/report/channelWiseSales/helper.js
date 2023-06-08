import Axios from "axios";

export const getChannelWiseSalesReportLandingData = async (
  accId,
  buId,
  chId,
  fromDate,
  toDate,
  fromTime,
  toTime,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/OManagementReport/GetChannelWiseSalesReport?AccountId=${accId}&BusinessunitId=${buId}&ChannelId=${chId}&FromDate=${fromDate}&ToDate=${toDate}&FromTime=${fromTime}&ToTime=${toTime}`
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
