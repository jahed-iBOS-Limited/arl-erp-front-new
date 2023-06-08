import axios from "axios";
import { toast } from "react-toastify";

export const getSBUListDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/fino/Disbursement/GetSbuDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const deleteCarrierAgent = async (id,uId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/wms/FertilizerOperation/DeleteLighterCarrier?AutoId=${id}&UserId=${uId}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
