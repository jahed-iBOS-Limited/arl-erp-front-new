import axios from "axios";
import { toast } from "react-toastify";

export const getInfoBySOCode = async (accId, buId, soCode, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesOrder/GetSalesOrderInfoByBarCode?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrderCode=${soCode}`
    );
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getLatLong = async (url, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.get(url);
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(
      "This location was not found to create hologram base delivery. please try another location!"
    );
    setLoading(false);
  }
};
