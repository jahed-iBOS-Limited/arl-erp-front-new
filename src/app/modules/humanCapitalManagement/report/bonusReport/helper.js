import Axios from "axios";
import { toast } from "react-toastify";

export const getApprovalLandingAction = async (
  accId,
  buId,
  statusId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    // make data empty first,
    setter([])
    const res = await Axios.get(
      `/hcm/BonusGenerate/GetBonusGenerateByStatus?accountId=${accId}&businessUnitId=${buId}&approveStatusId=${statusId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getApprovalDetailsViewAction = async (id, setLoading, setter) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/hcm/BonusGenerate/GetBonusGenerateById?id=${id}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const approveRejectAction = async (
  payload,
  setLoading,
  getLanding,
  statusId
) => {
  try {
    setLoading(true);
    const res = await Axios.put(
      `/hcm/BonusGenerate/UpdateBonusGenerateApproval`,
      payload
    );
    setLoading(false);
    getLanding(statusId);
    toast.success(res?.data?.message || "Updated Successfully");
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Please try again");
  }
};
