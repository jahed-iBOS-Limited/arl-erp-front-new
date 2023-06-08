import Axios from "axios";
import { toast } from "react-toastify";

export const saveRumenarationType = async (data, cb) => {
  console.log("type got", data);
  try {
    const res = await Axios.post(
      `/hcm/RemunerationType/CreateRemunerationType`,
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

export const getHRRumenarationTypePagination = async (accountId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/RemunerationType/RemunerationTypeLandingPasignation?AccountId=${accountId}&PageNo=1&PageSize=100&viewOrder=desc`
    );
    if (res.status === 200 && res?.data?.data) {
      console.log("rumenration", res.data);
      setter(res?.data?.data);
    }
  } catch (error) {
    
  }
};

export const getHRRumenarationTypeById = async (remunerationTypeId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/RemunerationType/GetRemunerationTypeById?RemunerationTypeId=${remunerationTypeId}`
    );
    if (res.status === 200 && res?.data) {
      const { remunerationType, monthlyPaid } = res?.data[0];
      const newData = {
        remunerationType: remunerationType,
        paid_by: {
          value: monthlyPaid ? "Monthly" : "Daily",
          label: monthlyPaid ? "Monthly" : "Daily",
        },
      };

      setter(newData);
    }
  } catch (error) {
    
  }
};

export const editHRRumenarationType = async (data, cb) => {
  console.log("edited data", data);

  try {
    const res = await Axios.put(
      `/hcm/RemunerationType/EditRemunerationType`,
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
