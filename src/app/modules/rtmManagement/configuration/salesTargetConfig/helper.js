import Axios from "axios";
import { toast } from "react-toastify";

// Real

export const createSalesTargetConfig = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);

    const res = await Axios.post(
      `/rtm/SalesTargetConfiguration/CreateSalesTargetConfiguration`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Created successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editSalesTargetConfig = async (payload, setDisabled) => {
  setDisabled(true);
  try {
   
    const res = await Axios.put(
      `/rtm/SalesTargetConfiguration/EditSalesTargetConfiguration`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message || "Edited successfully");
      // cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getSingleSalesTargetConfig = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/SalesTargetConfiguration/GetSalesTargetConfigurationById?autoId=${id}`
    );
    if (res.status === 200 && res?.data) {
      const values = res?.data[0];
      const data = {
        entryDay: values.lastTargetEntryDay,
        editedDay: values.lastTargetEditDay,
      };
      setter(data);
    }
  } catch (error) {
    
  }
};

export const getGridData = async (accId, buId, setter,setLoading,pageNo,pageSize) => {
  setLoading(true)
  try {
    const res = await Axios.get(
      `/rtm/SalesTargetConfiguration/SalesTargetConfigLandingPasignation?accountId=${accId}&businessUnitid=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=100`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false)
    }
  } catch (error) {
    
    setLoading(false)
  }
};
