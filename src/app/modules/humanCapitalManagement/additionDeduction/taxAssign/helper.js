import axios from "axios";
import { toast } from "react-toastify";

export const employeeTaxAssignAction = async (
  values,
  buId,
  userId,
  setLoading,
  cb
) => {
  try {
    const payload = {
      employeeId: values?.employee?.value,
      businessUnitId: buId,
      amount: +values?.amount,
      actionBy: userId,
    };
    setLoading(true);
    const res = await axios.post(
      "/hcm/HCMReport/CreateEmployeeTAXEntry",
      payload
    );

    setLoading(false);
    if (res?.data?.statusCode === 500) {
      toast.warn(res?.data?.message || "Failed, try again");
    } else {
      cb();
      toast.success(res?.data?.message || "Submitted Successfully");
    }
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed , try again");
  }
};

export const getTaxLandingAction = async (buId, setter, setLoading) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/hcm/HCMReport/GetEmployeeTAXReport?BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
