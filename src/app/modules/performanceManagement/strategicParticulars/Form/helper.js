import axios from "axios";
import { toast } from "react-toastify";

export const getCategoryDDLAction = async (setter) => {
  try {
    const res = await axios.get(`/pms/CommonDDL/StrategicParticularsTypeDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getCorporateDepDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeCorporateDepertmentDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const strLandingActiveInactiveAction = async (
  payload,
  setLoading,
  cb
) => {
  try {
    setLoading(true);
    const res = await axios.put(
      `/pms/StrategicParticulars/EditStrategicParticularsActiveInactive`,
      payload
    );
    toast.success(res?.data?.message || "Successfull");
    setLoading(false);
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
