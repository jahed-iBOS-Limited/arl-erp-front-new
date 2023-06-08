import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getRouteByterritoryId = async (accId, buId, tId, setter) => {
      //  `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${172}&TerritoryId=${451}`
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/RouteByTerritoryIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${tId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getTargetDateByMonth = async (
  accId,
  buId,
  monthId,
  yearId,
  setFieldValue
) => {
  try {
    let res = await axios.get(
      `/rtm/DamageConfiguration/GetDamageMonthConfigurationsByMonth?AccountId=${accId}&BusinessUnitId=${buId}&MonthId=${monthId}&YearId=${yearId}`
    );
    if (res?.status === 200) {
      setFieldValue("fromDate", _dateFormatter(res?.data?.startDate));
      setFieldValue("toDate", _dateFormatter(res?.data?.endDate));
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const createSalesTargetSetup = async (payload, cb) => {
  try {
    let res = await axios.post(`/rtm/SalesTarget/CreateSalesTarget`, payload);
    if (res?.status === 200) {
      toast.success(res?.data?.message || "Data saved successfully");
      cb();
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const editSalesTargetSetup = async (payload) => {
  try {
    let res = await axios.put(`/rtm/SalesTarget/EditSalesTarget`, payload);
    if (res?.status === 200) {
      toast.success(res?.data?.message || "Data saved successfully");
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getTerritoryTypeDDL = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/oms/TerritoryTypeInfo/GetTerritoryTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getPerentTerritoryInfo = async (
  accId,
  buId,
  ttId,
  setFieldValue,
  setParentTerritory
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetTerritoryInfoById?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${ttId}`
    );
    setFieldValue("parentTerritory", res?.data?.parentTerritoryName);
    setFieldValue("parentTerritoryId", res?.data?.parentTerritoryId);
    setParentTerritory(res?.data?.parentTerritoryName);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getTerritoryDDL = async (accId, buId, ttId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetTerritoryByTypeIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryTypeId=${ttId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getMonthDDL = async (setter) => {
  try {
    let res = await axios.get(`/rtm/RTMDDL/GetMonthDDl`);
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getTerritorySalesTargetInfo = async (
  accId,
  buId,
  territoryId,
  monthId,
  yearId,
  routeId,
  setter,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/rtm/SalesTarget/GetTerritorySalesTargetInfo?accountId=${accId}&businessUnitId=${buId}&territoryId=${territoryId}&routeId=${routeId}&month=${monthId}&year=${yearId}`
    );
    setDisabled(false);
    setter(res?.data);
    cb();
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const getPerentTerritorySalesTarget = async (
  accId,
  buId,
  territoryId,
  monthId,
  yearId,
  setter
) => {
  try {
    let res = await axios.get(
      `/rtm/SalesTarget/GetParentTerritorySalesTargetInfo?accountId=${accId}&businessUnitId=${buId}&territoryId=${territoryId}&month=${monthId}&year=${yearId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const GetDistributionChannelDDL_api = async (accId, buId, setter) => {
  try {
    let res = await axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
export const GetRegionIdDDL_api = async (accId, buId, channelId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetRegionByChannelIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const GetAreaDDL_api = async (
  accId,
  buId,
  channelId,
  regionId,
  setter
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&RegionId=${regionId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
export const GetTerritoryDDL_api = async (
  accId,
  buId,
  channelId,
  areaId,
  setter
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&AreaId=${areaId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const GetPointDDL_api = async (
  accId,
  buId,
  channelId,
  territoryId,
  setter
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetPointDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&TerritoryId=${territoryId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
export const GetSectionDDL_api = async (
  accId,
  buId,
  channelId,
  pointId,
  setter
) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetSectionDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&PointId=${pointId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
