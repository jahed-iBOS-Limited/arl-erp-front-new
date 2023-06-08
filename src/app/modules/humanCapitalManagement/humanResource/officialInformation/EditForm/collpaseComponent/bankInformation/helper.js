import Axios from "axios";
import { toast } from "react-toastify";

export const getCountryDDL = async (setter) => {
  try {
    const res = await Axios.get(`/oms/TerritoryInfo/GetCountryDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const getBankDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetBankDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};
export const getBankBranchDDL_api = async (bankId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBankBranchDDL?BankId=${bankId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const employeeBankInformation_api = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      "/hcm/EmployeeBankInformation/CreateEmployeeBankInformation",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    console.log(error, "erros")
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

//getEmployeeBankInformationById
export const getEmployeeBankInformationById_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeeBankInformation/GetEmployeeBankInformationByEmployeeId?EmployeeId=${id}`
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

export const editEmployeeBankInformation_api = async (
  payload,
  cb,
  setDisabled
) => {
  
  let isValid = payload?.filter((item) => item?.bankBranchName === "");
  if (isValid?.length > 0)
    return toast.warn("Please add bank branch name");
  setDisabled(true);
 
  try {
   
    const res = await Axios.put(
      "/hcm/EmployeeBankInformation/EditEmployeeBankInformation",
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
