import Axios from "axios";
import { toast } from "react-toastify";

export const getRumenarationComponentPagination = async (
  accountId,
  setter,
  setLoader,
  pageNo,
  pageSize
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/RemunerationComponent/RemunerationComponentLandingPasignation?AccountId=${accountId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    
    setLoader(false);
  }
};

export const saveRumenarationComponent = async (data, cb, setDisabled) => {
  setDisabled(true);
  console.log("component", data);
  try {
    const res = await Axios.post(
      `/hcm/RemunerationComponent/CreateRemunerationComponent`,
      data
    );
    if (res.status === 200) {
      toast.success("Created successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getRumenarationComponentById = async (
  remunerationComponentId,
  setter
) => {
  console.log("id", remunerationComponentId);
  try {
    const res = await Axios.get(
      `/hcm/RemunerationComponent/GetRemunerationComponentById?RemunerationComponentId=${remunerationComponentId}`
    );
    console.log("res,,,", res.data[0]);
    if (res.status === 200 && res?.data) {
      const newData = {
        remunerationComponent: res.data[0].remunerationComponent,
        remunerationComponentCode: res.data[0].remunerationComponentCode,
        defaultPercentOnBasic: res.data[0].defaultPercentOnBasic,
        remunerationComponetTypeId: res.data[0].remunerationComponetTypeId,
        isOnBasic: res.data[0].isOnBasic,
      };

      console.log("newDataaa", newData);

      setter(newData);
    }
  } catch (error) {
    
  }
};

export const editRumenarationComponent = async (data, setDisabled) => {
  setDisabled(true);
  console.log("edit component remuneration", data);
  try {
    const res = await Axios.put(
      `/hcm/RemunerationComponent/EditRemunerationComponent`,
      data
    );
    if (res.status === 200) {
      toast.success("Edited successfully");
      setDisabled(false);
      // cb();
    }
  } catch (error) {
    
    setDisabled(false);
  }
};

export const getComponentTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/hcm/HCMDDL/GetComponentTypeDDL`);
    if (res.status === 200 && res?.data) {
      console.log("component type ddl", res.data);
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
