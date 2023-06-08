import Axios from "axios";
import { toast } from "react-toastify";

export const getTerritoryTypeDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/GetTerritoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTerritoryDDL = async (accId, buId, typeId, setter) => {
  try {
    // const res = await Axios.get(
    //   `/rtm/RTMDDL/GetTerritotoryWithLevelByEmpDDL?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    // );
    const res = await Axios.get(
      `/rtm/RTMDDL/GetTerritoryByTypeIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryTypeId=${typeId}`
    );
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

export const getLandingDataForRouteCreate = async (
  userId,
  date,
  setLoading,
  pageNo,
  pageSize,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/Route/GetRouteLandingPaginationDateWise?actionBy=${userId}&date=${date}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getRouteLanding = async (
  accountId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/Route/GetRouteLandingPagination?AccountId=${accountId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const saveRouteAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/rtm/Route/CreateRoute`, data);
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

export const saveEditedRoute = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/rtm/Route/EditRoute`, data);
    if (res.status === 200) {
      cb();
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetRouteId = async (routeId, setter) => {
  try {
    const res = await Axios.get(`/rtm/Route/GetRouteDTO?IntRouteId=${routeId}`);
    if (res.status === 200 && res?.data) {
      const data = res?.data[0];
      const newData = {
        ...data,
        territoryType: {
          value: data.territoryTypeId,
          label: data.territoryTtypeName,
        },
        territoryName: {
          value: data.territoryId,
          label: data.territoryName,
        },
        startOutlateName: {
          value: data.startOutletId,
          label: data.startOutletName,
        },
        endOutlateName: {
          value: data.endOutleId,
          label: data.endOutletName,
        },
      };
      setter(newData);
    }
  } catch (error) {}
};
