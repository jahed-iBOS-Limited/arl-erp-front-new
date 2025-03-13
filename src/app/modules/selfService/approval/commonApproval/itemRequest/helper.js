import axios from "axios";
import { toast } from "react-toastify";



export const approvalApi = async (
  parameter,
  poayload,
  activityName,
  onChangeForActivity,
  setBillSubmitBtn
) => {
  try {
    await axios.put(`/procurement/Approval/CommonApproved?AcountId=${parameter.accid}&BusinessUnitId=${parameter?.buId}&UserId=${parameter?.userId}&ActivityId=${parameter?.activityId}`, poayload);
    toast.success("Approved successfully");
    setBillSubmitBtn(true)
    onChangeForActivity();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Approval Failed");
  }
};
