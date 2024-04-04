import axios from "axios";
import { toast } from "react-toastify";

export const inactivePrintedInfo = async (soId, userId, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/oms/OManagementReport/InactivePrintedPaperDO?SalesOrderId=${soId}&userId=${userId}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
