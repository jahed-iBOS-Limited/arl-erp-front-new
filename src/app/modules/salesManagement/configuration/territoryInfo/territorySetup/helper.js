import Axios from "axios";
import { toast } from "react-toastify";

export const getTerritoryTypeDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryTypeInfo/GetTerritoryTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    if (res?.status === 200 && res?.data) {
      res.data.push({
        label: "Top",
        value: 0,
      });
      setter(res?.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

// https://localhost:44380/api/TerritoryConfiguration/GetTerritoryConfiguration?AccountId=2&BusinessUnitId=164
export const getTerritorySetupLanding = async (
  accountId,
  buId,
  channelId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/TerritoryConfiguration/GetTerritoryConfiguration?AccountId=${accountId}&BusinessUnitId=${buId}&ChannelId=${channelId}`
    );
    if (res?.status === 200 && res?.data) {
      setLoading(false);
      for (let i = 0; i < res?.data?.objInfoList?.length; i++) {
        for (let j = 0; j < res?.data?.objTypeList?.length; j++) {
          if (
            !res?.data?.objInfoList[i][
            res?.data?.objTypeList[
              j + 1
            ]?.territoryTypeCodeName?.toLowerCase()
            ]
          ) {
            res.data.objInfoList[i]["editBtn"] =
              res?.data?.objTypeList[j].territoryTypeCodeName.toLowerCase();
            if (j < res?.data?.objTypeList.length - 1) {
              res.data.objInfoList[i]["addBtn"] =
                res?.data?.objTypeList[
                  j + 1
                ].territoryTypeCodeName.toLowerCase();
            }
            break;
          }
        }
      }
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

// https://localhost:44380/rtm/TerritoryConfiguration/CreateTerritoryConfiguration
export const saveTerritorySetup = async (data, cb) => {
  try {
    const res = await Axios.post(
      `/rtm/TerritoryConfiguration/CreateTerritoryConfiguration`,
      data
    );
    if (res?.status === 200) {
      toast.success("Save Successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    cb();
  }
};
export const editTerritorySetup = async (data, cb) => {
  try {
    const res = await Axios.put(
      `/rtm/TerritoryConfiguration/EditTerritoryConfiguration`,
      data
    );
    if (res?.status === 200) {
      toast.success("Update successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    cb();
  }
};

export const saveEditedSalesforeclabel = async (data, setDisabled, cb) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/rtm/RtmsalesforceLabelInfo/EditRtmsalesforceLabelInfo`,
      data
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message || "Edited successfully", {
        toastId: "saveEditedSalesforceLabel",
      });
      setDisabled(false);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetbyId = async (salesLabelById, setter) => {
  try {
    const res = await Axios.get(
      `/rtm/RtmsalesforceLabelInfo/GetRtmsalesforceLabelInfoById?GetRTMSalesLabelById=${salesLabelById}`
    );
    if (res?.status === 200 && res?.data) {
      const data = res?.data[0];
      const newData = {
        ...data,
        labelName: data?.strLabelName,
        territoryType: {
          value: data.intTerritoryTypeId,
          label: data.intTerritoryTypeName,
        },
        isVisit:
          data?.isRouteWiseVisit === true ? "routeWise" : "territoryWise",
        isAllow:
          data?.isSomenuAllow === true
            ? "soMenu"
            : data?.isTsmmenuAllow === true
              ? "tsmMenu"
              : "allow",
      };
      setter(newData);
    }
  } catch (error) { }
};

export const GetEmployeeList = async (
  accId,
  buId,
  territoryId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/RTMCommonProcess/GetEmployeeInfoByTerritory?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter("");
    setLoading(false);
  }
};


export const getChannelDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(`/rtm/RTMDDL/GetDistributionChannel?AccountId=${accId}&BusinessUnitId=${buId}`)
    setter([{ value: 0, label: "All" }, ...res?.data])
  } catch (error) {
    setter([])
  }
}