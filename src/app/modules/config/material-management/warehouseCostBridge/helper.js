import axios from "axios";
import { toast } from "react-toastify";

export const getNewApplicationData = async (accId, buId, setter, setLoader) => {
  setLoader(true);
  try {
    const res = await axios.get(
      `/wms/ItemPlantWarehouse/GetItemConfigurationToUpdate?businessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
    setter([]);
  }
};

export const approveAll = async (payload, setLoader, cb) => {
  setLoader(true);
  try {
    const res = await axios.post(
      `/wms/ItemPlantWarehouse/ItemConfigurationUpdate`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
      setLoader(false);
      cb();
    }
  } catch (error) {
    setLoader(false);
    toast.error(error?.response?.data?.message);
  }
};
