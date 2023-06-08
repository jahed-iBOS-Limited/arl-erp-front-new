import axios from "axios";
import { toast } from "react-toastify";

export const getDDL = async (api, setter) => {
  try {
    const res = await axios.get(api);
    if (res.status === 200 && res?.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getPartnerWiseRentSetupLanding = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/tms/PartnerWiseRentSetup/PartnerWiseRentSetupLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};


export const getPartnerWiseRentSetupById = async (
  accId,
  buId,
  partnerId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/tms/PartnerWiseRentSetup/GetPartnerWiseRentSetupById?AccountId=${accId}&BusinessUnitId=${buId}&PartnerId=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

// 

export const createPartnerWiseRentSetup = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/tms/PartnerWiseRentSetup/CreatePartnerWiseRentSetup`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const ExtendPartnerWiseRentSetup = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/tms/PartnerWiseRentSetup/CreatePartnerWiseRentSetupExtendSave`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Extended successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const ExtendPartnerById = async (id, setter) => {
  try {
    const res = await axios.get(
      `/tms/PartnerWiseRentSetup/GetPartnerWiseRentSetupById?rowId=${id}`
    );
    if (res.status === 200) {
      let singleData = res.data[0];
      let newdata = {
        shipPoint: {
          value: singleData.intshippointId,
          label: singleData.shippointName,
        },
        vehicle: {
          value: singleData.intVehicleId,
          label: singleData.intVehicleId,
        },
        rent: "",
        additionalRent: "",
        reason: "",
      };
      setter(newdata);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
