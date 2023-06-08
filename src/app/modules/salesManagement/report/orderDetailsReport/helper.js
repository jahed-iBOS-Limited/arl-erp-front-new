import Axios from "axios";

export const getOrderDetailsReportData = async (
  accId,
  buId,
  orderId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesOrder/GetOrderDetailsReport?AccountId=${accId}&BusinessUnitId=${buId}&OrderId=${orderId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
