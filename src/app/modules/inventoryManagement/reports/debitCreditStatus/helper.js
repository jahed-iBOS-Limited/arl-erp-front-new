import Axios from "axios";
import { toast } from "react-toastify";

export const debitCreditStatus = async (
  accId,
  buId,
  fromDate,
  toDate,
  disId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/WmsReport/CustomerDebitCreditStatus?accountId=${accId}&businessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&DistributionChannel=${disId}`
    );
    setter(res?.data);

    console.log("res", res);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Error occured");
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
