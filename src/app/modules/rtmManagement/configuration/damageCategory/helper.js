import axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (dmId,accId, buId,pageNo,pageSize, setIsLoading, setter) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/DamageCategory/DamageCategoryLandingPasignation?damageTypeId=${dmId}&accountId=${accId}&businessUnitId=${buId}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setIsLoading(false);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message);
      setIsLoading(false);
    }
  }
};

export const createDamageCategory = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(`/rtm/DamageCategory/CreateDamageCategory`, payload);
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "CreateDamageCategory" });
      setIsLoading(false);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message, {
        toastId: "CreateDamageCategory",
      });
      setIsLoading(false);
    }
  }
};

export const editDamageType = async (payload, setIsLoading) => {
  setIsLoading(true);
  try {
    let res = await axios.put(`/rtm/DamageCategory/EditDamageCategory`, payload);
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "editBusinessType" });
      setIsLoading(false);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message, {
        toastId: "editBusinessTypeErr",
      });
      setIsLoading(false);
    }
  }
};

export const getDamageCategoryById = async (
  id,
  setter
) => {
  try {
    let res = await axios.get(
      `/rtm/DamageCategory/GetDamageCategoryById?dmgCategoryId=${id}`
    );
    if (res?.status === 200) {
      let obj ={
        ...res.data,
        damageType:{
          label:res?.data?.damageTypeName,
          value:res?.data?.damageTypeId
        },
        categoryName:res?.data?.dmgCatagoryName
      }
      setter(obj);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      toast.warning(err?.response?.data?.message);
    }
  }
};



export const getDamageTypeDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/DamageTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    if (err?.response?.status === 500) {
      console.log(err?.response?.data?.message);
    }
  }
};
