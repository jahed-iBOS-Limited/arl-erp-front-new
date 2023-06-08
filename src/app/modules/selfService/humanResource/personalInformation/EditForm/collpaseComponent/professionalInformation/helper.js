import axios from "axios";
import { toast } from "react-toastify";

export const religionDDL_api = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/ReligionDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const employeeProfessionalInfo_api = async (
  payload,
  cb,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await axios.post(
      "/hcm/EmployeeProfessionalInfo/CreateEmployeeProfessionalInfo",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

//employeeProfessionalInfoId_api
export const employeeProfessionalInfoId_api = async (id, setter) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeProfessionalInfo/GetEmployeeProfessionalInfoById?EmployeeProfessionalInfoId=${id}`
    );
    if (res.status === 200 && res.data) {
      const data = res.data;
      if (res.data.length > 0) {
        setter(data);
      } else {
        setter([]);
      }
    }
  } catch (error) {
    
  }
};

export const editEmployeeProfessionalInfo_api = async (
  payload,
  cb,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await axios.put(
      "/hcm/EmployeeProfessionalInfo/EditEmployeeProfessionalInfo",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
