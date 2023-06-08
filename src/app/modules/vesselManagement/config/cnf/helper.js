import axios from "axios";
import { toast } from "react-toastify";

export const deleteCNF = async (id, uId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `wms/FertilizerOperation/DeleteLighterCNF?CNFid=${id}&UserId=${uId}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const editCNF = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/wms/FertilizerOperation/EditLighterCNF`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
