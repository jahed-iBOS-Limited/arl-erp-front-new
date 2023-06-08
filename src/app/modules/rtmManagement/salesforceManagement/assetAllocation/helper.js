import axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (
  accId,
  buId,
  routeId,
  beatId,
  isAllocated,
  pageNo,
  pageSize,
  setter,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    let res;
    if (isAllocated === 1) {
      res = await axios.get(
        `/rtm/AssetAllocation/GetAssetAllocationPagination?accountId=${accId}&businessUnitid=${buId}&PageNo=${pageNo}&RouteId=${routeId}&BeatId=${beatId}&allocationStatus=true&PageSize=${pageSize}&vieworder=desc`
      );
    } else {
      res = await axios.get(
        `/rtm/AssetAllocation/GetAssetAllocationPagination?accountId=${accId}&businessUnitid=${buId}&PageNo=${pageNo}&RouteId=${routeId}&BeatId=${beatId}&allocationStatus=false&PageSize=${pageSize}&vieworder=desc`
      );
    }
    setter(res?.data);
    setIsLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setIsLoading(false);
  }
};

export const updateAllocation = async (payload, cb) => {
  try {
    let res = await axios.put(`/rtm/AssetAllocation/UpdateAllocation`, payload);
    if (res?.status === 200) {
      toast.success(res?.data?.message, {
        taostId: "updateAllocation",
      });
      cb();
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getTerritoryDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/TerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getRouteDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/RouteNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getBeatDDL = async (routeId, setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/BeatNameDDL?RouteId=${routeId}`);
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
