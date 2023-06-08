import Axios from "axios";
import { toast } from "react-toastify";

export const createEmployeeTrainingInfo_api = async (
  payload,
  cb,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      "/hcm/EmpTrainingInfo/CreateEmployeeTrainingInfo",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message || "Error");
    setDisabled(false);
  }
};

//getEmpTrainingInfoById_api
export const getEmpTrainingInfoById_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmpTrainingInfo/GetEmpTrainingInfoById?EmployeeId=${id}`
    );
    if (res.status === 200 && res.data) {
      const data = res.data;
      if (res.data.length > 0) {
        console.log(res?.data, "resdata")
        setter(data);
      } else {
        setter([]);
      }
    }
  } catch (error) {
    
  }
};

export const editEmployeeTrainingInfo_api = async (
  payload,
  cb,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      "/hcm/EmpTrainingInfo/EditEmployeeTrainingInfo",
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
