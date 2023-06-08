import Axios from "axios";
import { toast } from "react-toastify";

export const getEmployeeDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const createSalaryPayInBankAmountEntry = async (
  payload,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    let res = await Axios.post(
      `/hcm/HCMReport/CreateSalaryPayInBankAmountEntry`,
      payload
    );
    if (res?.data?.statusCode === 500) {
      toast.warn(res?.data?.message || "Failed, try again");
      setDisabled(false);
    } else {
      cb();
      toast.success(res?.data?.message || "Submitted Successfully");
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "createSalaryPayInBankAmountEntry",
    });
    setDisabled(false);
  }
};

export const getPayInBankLandingAction = async (buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/hcm/HCMReport/GetSalaryPayInBankAmountReport?BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
