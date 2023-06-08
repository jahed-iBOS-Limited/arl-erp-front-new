import axios from "axios";
import moment from "moment";


export const GetTransferChallanShipPointToShipPoint = async (
  from,
  to,
  accId,
  buId,
  fromDate,
  fromTime,
  toDate,
  toTime,
  setter,
  setLoading
) => {
  const fromDateTime = moment(`${fromDate} ${fromTime}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const toDateTime = moment(`${toDate} ${toTime}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/Challan/GetTransferChallanShippointToShippoint?FromShipPoint=${from}&ToShipPoint=${to}&AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDateTime}&ToDate=${toDateTime}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetTransferChallanDetails = async (
  from,
  to,
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/Challan/GetTransferChallanShippointToShippointDetails?FromShipPoint=${from}&ToShipPoint=${to}&AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
