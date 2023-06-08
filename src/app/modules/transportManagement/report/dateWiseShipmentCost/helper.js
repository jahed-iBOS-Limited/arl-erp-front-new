import axios from "axios";

export const getShipmentStandardCostByDate = async (
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
      `/tms/ShipmentExpReport/GetShipmentStandardCostByDate?AccountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&shipPointId=${shipPointId}`
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
