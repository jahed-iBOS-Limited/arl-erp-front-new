import Axios from "axios";
import { toast } from "react-toastify";

export const GetInformationSectionPagination = async (
  accountId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/partner/PartnerInformation/GetPartnerInfoSectionLanding?accountId=${accountId}&businessUnitId=${buId}&pageSize=${pageSize}&pageNo=${pageNo}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    
    setLoading(false);
  }
};

export const GetValueAdditionView = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/ProfileSection/GetById?id=${id}
      `
    );
    if (res?.status === 200 && res?.data) {
      const data = res?.data;
      const newData = {
        ...data,
        profileSectionName: data?.strProfileSection,
      };

      setter(newData);
    }
  } catch (error) {
    
  }
};

export const saveInformationSection = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/partner/PartnerInformation/CreatePartnerInfoSection`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const EditInformationSection = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/partner/PartnerInformation/EditPartnerInfoSection`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};


// isActive
export const isActiveByInformationSectionId = async (
  data
) => {
  console.log(data)
  try {
    const res = await Axios.put(
      `/partner/PartnerInformation/ActiveInactivePartnerInfoSection`,
      data
    );
    console.log(res)

    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
    }
  } catch (error) {
   
  }
};