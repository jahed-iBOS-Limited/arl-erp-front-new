import Axios from "axios";

export const getChannelWiseSalesReportLandingData = async (
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(`/oms/SalesInformation/UpdateBalance`);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
