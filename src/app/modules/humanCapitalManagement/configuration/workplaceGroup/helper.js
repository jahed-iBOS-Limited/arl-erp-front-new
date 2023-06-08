import axios from "axios";
import { toast } from "react-toastify";

export const getWorkplaceGroupPagination = async (
  accId,
  setter,
  setLoader,
  pageNo,
  pageSize
) => {
  setLoader(true);
  try {
    const res = await axios.get(
      `/hcm/WorkPlaceGroup/WorkPlaceGroupLandingPagination?AccountId=${accId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}
      `
    );

    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
   
    setLoader(false);
  }
};

export const getWorkplaceGroupById = async (id, setter) => {
  try {
    const res = await axios.get(`/hcm/WorkPlaceGroup/GetWorkPlaceGroupById?WorkPlaceGroupById=${id}
    `);

    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const createWorkplaceGroup = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/hcm/WorkPlaceGroup/CreateWorkplaceGroup`,
      data
    );

    if (res.status === 200) {
      toast.success("Submitted Successfully" || res.data?.message);
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveEditedWorkpalceGroup = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(`/hcm/WorkPlaceGroup/EditWorkplaceGroup`, data);

    if (res.status === 200) {
      toast.success(res.data?.message || "Edited Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    console.log(error?.message);
    setDisabled(false);
  }
};
