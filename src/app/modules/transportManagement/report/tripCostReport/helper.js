import axios from "axios";

export const GetTripCostReport_api = async (
  accId,
  buId,
  fromDate,
  toDate,
  shipPointId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/ShipmentExpReport/GetTripCostReport?AccountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&shipPointId=${shipPointId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
