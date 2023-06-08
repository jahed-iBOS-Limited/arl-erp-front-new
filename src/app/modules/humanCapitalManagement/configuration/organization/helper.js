import Axios from "axios";
import { toast } from "react-toastify";

export const getOrganizationComponent = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/OrganizationComponent/OrganizationComponentLandingPagination?AccountId=${accountId}&viewOrder=desc&PageNo=1&PageSize=100`
    );
    if (res.status === 200 && res?.data?.data) {
      console.log("organization component", res.data);
      setter(res?.data?.data);
    }
  } catch (error) {
    
  }
};

export const saveOrganizationComponent = async (data, cb, setDisabled) => {

  try {
    setDisabled && setDisabled(true)
    const res = await Axios.post(
      `/hcm/OrganizationComponent/CreateOrganizationComponent`,
      data
    );
    setDisabled && setDisabled(false)
    if (res.status === 200) {
      toast.success("Created successfully");
      cb();
    }
  } catch (error) {
    setDisabled && setDisabled(false)
    toast.error(error?.response?.data?.message);
  }
};

export const getOrganizationComponentById = async (orgComponentId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/OrganizationComponent/GetOrganizationComponentById?OrganizationComponentId=${orgComponentId}`
    );
    if (res.status === 200 && res?.data) {
      const { orgComponentCode, orgComponentName } = res?.data[0];

      const newData = {
        orgComponentCode,
        orgComponentName,
      };

      setter(newData);
    }
  } catch (error) {
    
  }
};
export const editOrganizationComponent = async (data, setDisabled) => {
  console.log(data);
  try {
    setDisabled && setDisabled(true)
    const res = await Axios.put(
      `/hcm/OrganizationComponent/EditOrganizationComponent`,
      data
    );
    setDisabled && setDisabled(false)
    if (res.status === 200 && res?.data) {
      if (res.status === 200) {
        toast.success("Edited successfully");
        // cb();
      }
    }
  } catch (error) {
    setDisabled && setDisabled(false)
  }
};
