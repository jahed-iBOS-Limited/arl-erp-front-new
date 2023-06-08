import Axios from "axios";
import { toast } from "react-toastify";

// Real

export const createCustomerCollection = async (payload, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/rtm/CustomerCollection/CreateCustomerCollection`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Submitted successfully");

      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getGridData = async (
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/rtm/CustomerCollection/CustomerCollectionLandingPagination?fromDate=${fromDate}&toDate=${toDate}&PageNo=1&PageSize=111&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    
    setLoading(false);
  }
};
