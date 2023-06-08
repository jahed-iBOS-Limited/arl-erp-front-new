import Axios from "axios";
import { toast } from "react-toastify";

export const getEmployeeEducationLevelDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetEmployeeEducationLevelDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const getYearDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/EmployeeEducation/GetYearDDL?yearType=1");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const getEmployeeEducationDegreeDDL_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetEmployeeEducationDegreeDDL?levelOfEducation=${id}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};
export const getResultDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetResultDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const createEmployeeEducation_api = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      "/hcm/EmployeeEducation/CreateEmployeeEducation",
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

//getFamilyInfoById_api
export const getEmployeeEducationByEmpId_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeeEducation/GetEmployeeEducationByEmpId?EmployeeEducationInfoId=${id}`
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

export const editEmployeeEducation_api = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      "/hcm/EmployeeEducation/EditEmployeeEducation",
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
