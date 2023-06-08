import axios from "axios";
import moment from "moment";

export const GetCustomerChallanFromGhat = async (
  accId,
  buId,
  shipPointId,
  fromDate,
  fromTime,
  toDate,
  toTime,
  setter,
  setLoading
) => {
  const fromDateTime = moment(`${fromDate} ${"00:00"}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const toDateTime = moment(`${toDate} ${"00:00"}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/Challan/GetCustomerChallanFromGhat?ShipPoint=${shipPointId}&AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDateTime}&ToDate=${toDateTime}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetCustomerChallanFromGhatDetails = async (
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
      `/wms/Challan/GetCustomerChallanFromGhatDetails?ShipPoint=${shipPointId}&AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
