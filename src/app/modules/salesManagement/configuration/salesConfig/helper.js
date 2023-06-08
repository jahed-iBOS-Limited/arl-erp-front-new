import Axios from "axios";
import { toast } from "react-toastify";

export const getSalesConfigPagination = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/BusinessUnitSalesOrderTypeConfig/GetBUSOTypeConfigByAcBuId?AccountId=${accountId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const saveSalesConfigItem = async (payload,setDisabled) => {
  setDisabled(true)
  try {
    const res = await Axios.post(
      `/oms/BusinessUnitSalesOrderTypeConfig/CreateMultipleBUSOTypeConfig`,
      payload.data
    );
    if (res.status === 200) {
      setDisabled(false)
      toast.success(res.data?.message || "Submitted successfully");
      payload.cb();
    }
  } catch (error) {
    setDisabled(false)
    
    toast.error(error?.response?.data?.message);
  }
};
