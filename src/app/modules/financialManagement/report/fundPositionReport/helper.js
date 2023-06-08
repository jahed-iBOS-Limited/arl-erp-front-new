import Axios from "axios";
export const getFundPositionReportLanding = async (
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `fino/FundManagement/FundPositionReport?businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
