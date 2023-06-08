import axios from "axios";
import { toast } from "react-toastify";

export const getTerritoryTypeDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/TerritoryTypeInfo/GetTerritoryTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getTerritoryByTypeIdDDL = async (
  accid,
  buid,
  territoryTypeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/GetTerritoryByTypeIdDDL?AccountId=${accid}&BusinessUnitId=${buid}&TerritoryTypeId=${territoryTypeId}`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getTerritoryDDLByTypeAndDisId = async (
  accId,
  buId,
  cId,
  tTypeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/TerritoryTypeIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${cId}&territoryType=${tTypeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getDistributionChannelDDL = async (accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accid}&BUnitId=${buid}`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const createSalesForceTerritory = async (
  payload,
  cb,
  setDisabled,
  cb2
) => {
  try {
    const res = await axios.post(
      "/rtm/SalesForceTransfer/CreateSalesForceTerritory",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      cb2();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getSalesForceTerritory = async (
  accid,
  buid,
  employeeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/rtm/SalesForceTransfer/GetSalesForceTerritory?AccountId=${accid}&BusinessUnitId=${buid}&EmployeeId=${employeeId}`
    );

    if (res.status === 200) {
      const data = res?.data;
      const newData = {
        ...data,
        territoryType: {
          value: data?.territoryTypeId,
          label: data?.territoryTypeName,
        },
        distributionChannel: {
          value: data?.distributionChannelId,
          label: data?.distributionChannelName,
        },
        territory: {
          value: data?.territoryId,
          label: data?.territoryName,
        },
        // Last Change | Bussiness Change | Assign By Iftakhar Alam
        // region: {
        //   value: data?.regionId,
        //   label: data?.regionName,
        // },
        // area: {
        //   value: data?.areaId,
        //   label: data?.areaName,
        // },
        // point: {
        //   value: data?.pointId,
        //   label: data?.pointName,
        // },
        // section: {
        //   value: data?.sectionId,
        //   label: data?.sectionName,
        // },
      };
      setter(newData);
    }
  } catch (error) {}
};

// Last Change | Assign By Iftakhar Alam
export const getRegionDDL = async (accId, buId, chId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetRegionByChannelIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${chId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getPointDDL = async (accId, buId, chId, tId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetPointDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${chId}&TerritoryId=${tId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getAreaDDL = async (accId, buId, cId, reId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${cId}&RegionId=${reId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getTerritoryDDL = async (accId, buId, cId, aId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${cId}&AreaId=${aId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getSectionDDL = async (accId, buId, cId, pId, setter) => {
  try {
    let res = await axios.get(
      `/rtm/RTMDDL/GetSectionDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${cId}&PointId=${pId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};
