import Axios from "axios";
import { toast } from "react-toastify";

// Create performance guarantee;
export const performanceGuaranteeCreate = async (
  payload,
  setDisabled,
  setIsShowModal,
  cb
) => {
  setDisabled(true);

  try {
    let res = await Axios.post(`/imp/FormulaForCalculation/CreatePG`, payload);

    setDisabled(false);
    toast.success(res?.response?.data || "Create successfully");
    setIsShowModal(false);
    cb && cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setIsShowModal(false);
  }
};
