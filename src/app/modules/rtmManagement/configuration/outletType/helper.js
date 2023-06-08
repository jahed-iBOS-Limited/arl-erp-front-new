// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (
  accId,
  buId,
  setIsLoading,
  setter,
  pageNo,
  pageSize,
  date,
  actionBy
) => {
  setIsLoading(true);
  try {
    if (!date && !actionBy) {
      let res = await axios.get(
        `/rtm/BusinessType/BusinessTypeLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      if (res?.status === 200) {
        setter(res?.data);
        setIsLoading(false);
      }
    } else if (date && actionBy) {
      let res = await axios.get(
        `/rtm/BusinessType/BusinessTypeLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&ActionBy=${actionBy}&CurrentDate=${date}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      if (res?.status === 200) {
        setter(res?.data);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setIsLoading(false);
  }
};

export const createBusinessType = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(`/rtm/BusinessType/CreateBusinessType`, payload);
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "createBusinessType" });
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "createBusinessErr",
    });
    setIsLoading(false);
  }
};

export const editBusinessType = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.put(`/rtm/BusinessType/EditBusinessType`, payload);
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "editBusinessType" });
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "editBusinessTypeErr",
    });
    setIsLoading(false);
  }
};

export const getOutletTypeById = async (
  businessTypeId,
  setIsLoading,
  setter
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/BusinessType/GetBusinessTypeById?BusinessTypeId=${businessTypeId}`
    );
    if (res?.status === 200) {
      setIsLoading(false);
      setter({
        ...res?.data[0],
        businessType: res?.data[0]?.businessTypeName,
        isOnlyTmsAllowed: res?.data[0]?.isOnlyTmsAllowed,
      });
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setIsLoading(false);
  }
};
