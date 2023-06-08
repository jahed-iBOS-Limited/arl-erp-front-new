import Axios from "axios";
import { toast } from "react-toastify";

export const getEmployeeDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

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

export const getTerritoryDDLByTypeAndDisId = async (
  accId,
  buId,
  cId,
  tTypeId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/rtm/RTMDDL/TerritoryTypeIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${cId}&territoryType=${tTypeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getTerritoryDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetTerritoryDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getDistributionChannelDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSalesForceTransferLanding = async (
  accountId,
  buId,
  setLoading,
  employeeId,
  pageNo,
  pageSize,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/SalesForceTransfer/SalesForceTransferLanding?AccountId=${accountId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}&pageNo=${pageNo}&pageSize=${pageSize}&vieworder=desc`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const saveSalesforceTransferAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/SalesForceTransfer/CreateSalesForceTransfer`,
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
