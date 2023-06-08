import axios from "axios";
import { toast } from "react-toastify";

export const getCorporateDepertmentDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeCorporateDepertmentDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
