import Axios from "axios";
import { toast } from "react-toastify";

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetRTMPartnerDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const PrimaryCollectionLandingApi = async (
  accountId,
  buId,
  RouteId,
  orderStatus,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/rtm/SecondaryCollection/SecondaryCollectionLandingPasignation?AccountId=${accountId}&BusinessunitId=${buId}&RouteId=${RouteId}&orderStatus=${orderStatus}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      console.log(res?.data, "api");
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getBeatNameDDL = async (routeId, setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${routeId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getOutletNameDDL = async (routeId, setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/OutletNameDDL?RouteId=${routeId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemDDL = async (setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/FinishedItemDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getOutletInfoDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetOutletInfoDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSecondaryOrderLanding = async (
  accountId,
  buId,
  fromdate,
  toDate,
  // setLoading,
  pageNo,
  pageSize,
  setter,
  gridData
) => {
  // setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/PrimaryCollection/GetPrimaryCollectionPasignation?AccountId=${accountId}&BusinessUnitId=${buId}&FromDate=${fromdate}&ToDate=${toDate}&IsReceived=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      // setLoading(false);
      gridData(res?.data);
      const newRowDto = res?.data?.data?.map((itm) => ({
        ...itm,
        itemCheck: false,
      }));
      setter(newRowDto);
    }
  } catch (error) {
    // setLoading(false);
  }
};

export const savSecondaryOrderAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/PrimaryCollection/CreatePrimaryCollection`,
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

export const saveEditedSecondaryOrder = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/rtm/PrimaryCollection/EditPrimaryCollection`,
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

export const getSingleData = async (ordrId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/PrimaryCollection/GetPrimaryCollectionById?id=${ordrId}`
    );
    let obj = {
      partnerName: {
        label: res.data[0].businessPartnerName,
        value: res.data[0].businessPartnerId,
      },
      amount: res.data[0].amount,
    };
    setter(obj);
  } catch (error) {}
};

export const approvePrimaryCollection = async (data, cb) => {
  try {
    const res = await Axios.put(
      `/rtm/PrimaryCollection/ApprovePrimaryCollection`,
      data
    );
    if (res.status === 200) {
      cb();
      toast.success(res.data?.message || "Submitted successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
