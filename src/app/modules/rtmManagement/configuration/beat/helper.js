// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";

export const getTerritoryDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/oms/TerritoryInfo/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getLandingDataForCreate = async (
  userId,
  date,
  setter,
  pageNo,
  pageSize
) => {
  try {
    let res = await axios.get(
      `/rtm/Beat/GetBeatLandingPasignationDateWise?ActionBy=${userId}&CurrentDate=${date}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getLandingData = async (
  accId,
  buId,
  terId,
  routeId,
  setLoading,
  setter,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    let res = await axios.get(
      `/rtm/Beat/GetBeatLandingPasignation?accountId=${accId}&businessUnitid=${buId}&TerritoryId=${terId}&RouteId=${routeId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};

export const createBeat = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    let res = await axios.post(`/rtm/Beat/CreateBeat`, payload);
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "createBeat" });
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "createBeatError",
    });
    setDisabled(false);
  }
};

export const editBeat = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    let res = await axios.put(`/rtm/Beat/EditBeat`, payload);
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "editBeat" });
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "editBeatError",
    });
    setDisabled(false);
  }
};

export const getBeatById = async (beatId, setDisabled, setter) => {
  setDisabled(true);
  try {
    let res = await axios.get(`/rtm/Beat/GetBeatById?beatId=${beatId}`);
    if (res?.status === 200) {
      setDisabled(false);
      const data = res?.data[0];
      const payload = {
        beatName: data?.beatName,
        beatCode: data?.beatCode,
        territory: {
          value: data?.territoryId,
          label: data?.territoryName,
        },
        route: {
          value: data?.routeId,
          label: data?.routeName,
        },
      };
      setter(payload);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
