import Axios from "axios";
import { toast } from "react-toastify";

export const GetProfileSectionPagination = async (
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
      `/hcm/ProfileSection/GetProfileSection?accountId=${accountId}&businessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc `
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

export const saveProfileSection = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/hcm/ProfileSection/CreateProfileSection`,
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

export const EditProfileSection = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/hcm/ProfileSection/EditProfileSection `,
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
export const isActiveByProfileSectionId = async (
  sectionId,
  isActive
) => {
  try {
    const res = await Axios.get(
      `/hcm/ProfileSection/IsActiveByProfileSectionId?profileSectionId=${sectionId}&IsActive=${isActive}`
    );

    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
    }
  } catch (error) {
   
  }
};