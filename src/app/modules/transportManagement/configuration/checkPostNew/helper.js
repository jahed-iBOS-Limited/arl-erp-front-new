import Axios from "axios";
import { toast } from "react-toastify";

//create cost component
export const createCheckPostList = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/CheckPostList/CreateCheckPostList`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    setDisabled(false);
  }
};
// landing pagination
export const CheckPostListLandingPagination = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/tms/CheckPostList/CheckPostListLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    
    setLoading(false);
  }
};
// get by id
export const getCheckPostListById = async (checkpostId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/CheckPostList/GetCheckPostListById?CheckPostId=${checkpostId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = {
        checkPostName: res?.data[0]?.checkPostName,
      };
      setter(newData);
    }
  } catch (error) {
    
  }
};
// edit
export const editCheckPostList = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/tms/CheckPostList/EditCheckPostList`, data);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    
    setDisabled(false);
  }
};
