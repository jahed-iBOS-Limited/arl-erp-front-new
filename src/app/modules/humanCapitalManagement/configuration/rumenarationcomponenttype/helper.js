import Axios from "axios";
import { toast } from "react-toastify";

export const getHRRumenarationComponentTypePagination = async (
  accountId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/hcm/RemunerationComponentType/RemunerationComponentTypeLandingPasignation?AccountId=${accountId}&PageNo=1&PageSize=100&viewOrder=desc`
    );
    if (res.status === 200 && res?.data?.data) {
      console.log("component type", res.data);
      setter(res?.data?.data);
    }
  } catch (error) {
    
  }
};

export const saveRumenarationComponentType = async (data, cb) => {
  console.log("component", data);
  try {
    const res = await Axios.post(
      `/hcm/RemunerationComponentType/CreateRemunerationComponentType`,
      data
    );
    if (res.status === 200) {
      toast.success("Created successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getRumenarationComponentTypeById = async (
  remunerationComponentTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/hcm/RemunerationComponentType/GetRemunerationComponentTypeById?RemunerationComponentTypeId=${remunerationComponentTypeId}`
    );
    if (res.status === 200 && res?.data) {
      const {
        remunerationComponentType,
        remunerationComponentTypeCode,
      } = res?.data[0];
      console.log(remunerationComponentType, remunerationComponentTypeCode);
      const newData = {
        remunerationComponentType: remunerationComponentType,
        remunerationComponentTypeCode: remunerationComponentTypeCode,
      };

      setter(newData);
    }
  } catch (error) {
    
  }
};

export const editHRRumenarationComponentType = async (data, cb) => {
  console.log("remuneration", data);
  try {
    const res = await Axios.put(
      `/hcm/RemunerationComponentType/EditRemunerationComponentType`,
      data
    );
    if (res.status === 200 && res?.data) {
      if (res.status === 200) {
        toast.success("Edited successfully");
        // cb();
      }
    }
  } catch (error) {
    
  }
};
