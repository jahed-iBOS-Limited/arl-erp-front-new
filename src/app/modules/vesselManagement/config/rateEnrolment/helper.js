import axios from "axios";
import { toast } from "react-toastify";

export const deleteMotherVessel = async (id, userId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/wms/FertilizerOperation/DisableMotherVessel?MotherVessleId=${id}&UserId=${userId}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const editMotherVessel = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/wms/FertilizerOperation/EditMotherVesselProgramInfo`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
