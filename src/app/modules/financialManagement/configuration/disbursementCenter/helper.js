import Axios from "axios";
import { toast } from "react-toastify";

//getSBUListDDL_api Api call
export const getSBUListDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/Disbursement/GetSbuDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

//createDisbursementCenter_api Api call
export const createDisbursementCenter_api = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/Disbursement/CreateDisbursementCenter`,
      data
    );
    if (res.status === 200 && res?.data) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
   
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editDisbursementCenter_api = async (data, setDisabled) => {
  console.log("from edit", data);
  setDisabled(true);
  try {
    const res = await Axios.put(
      `fino/Disbursement/EditDisbursementCenter`,
      data
    );
    if (res.status === 200 && res?.data) {
      toast.success(res?.message || "Submitted successfully");

      setDisabled(false);
    }
  } catch (error) {
   
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

//GetDisbursementcenterLandingPasignation Api call
export const getDisbursementcenterPasignation_api = async (
  accId,
  buId,
  sbuId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading(true);
  console.log(pageNo, pageSize);
  try {
    const res = await Axios.get(
      `/fino/Disbursement/GetDisbursementcenterLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
    
  }
};

//GetDisbursementcenterById Api call
export const getDisbursementcenterById_api = async (
  disbursementcenterId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/Disbursement/GetDisbursementcenterById?disbursementcenterId=${disbursementcenterId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = {
        disbursementCenter: res?.data?.disbursementCenterName,
        sbu: { value: res.data?.sbuid, label: res.data?.sbuname },
        disbursementCenterCode: res?.data?.disbursementCenterCode,
      };
      setter(newData);
    }
  } catch (error) {
    
  }
};
