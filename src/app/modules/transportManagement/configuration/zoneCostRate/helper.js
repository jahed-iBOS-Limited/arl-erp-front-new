import Axios from "axios";
import { toast } from "react-toastify";

export const createZoneCostSetup = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/ShipmentCostRate/CreateShipmentCostRate`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const editZoneCostSetup = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/tms/ShipmentCostRate/EditShipmentCostRate`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const ZoneCostRateLandingPagination = async (
  accId,
  userId,
  buId,
  shId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/tms/ShipmentCostRate/ShipmentStandardCostReportLandingPasignation?accountId=${accId}&businessunitid=${buId}&shipPointId=${shId}&actionBy=${userId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getZoneCostSetupById = async (
  zoneCostId,
  setter,
  setRows,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/ShipmentCostRate/GetShipmentCostRateById?zoneCostId=${zoneCostId}`
    );
    if (res.status === 200 && res?.data) {
      const payload = {
        zone: {
          value: res?.data?.zoneId,
          label: res?.data?.zoneName,
        },
        shipPoint: {
          value: res?.data?.shipPointId,
          label: res?.data?.shipPointName,
        },
        subsidiaryRate: res?.data?.numSubsidiaryRate,
        ...res?.data,
        // isSlabProgram:
        //   res?.data?.isSlabProgram === null ? true : res?.data?.isSlabProgram,
      };
      setRows(res?.data?.rateSalbs || []);
      setter(payload);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const editCheckPostList = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/tms/CheckPostList/EditCheckPostList`, data);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

// Delete
export const deleteZoneCostSetup = async (
  zoneCostId,
  userId,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    const res = await Axios.delete(
      `/tms/ShipmentCostRate/DeleteShipmentCostRate?zoneCostId=${zoneCostId}&actionBy=${userId}`
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getZoneDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
export const getIsSubsidyRunningApi = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/Shipment/GetIsSubsidyRunning?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter(false);
  }
};

export const getShipPointDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getIsAmountBase = async (buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetBusinessUnitTransportRateType?BusinessUnitId=${buId}`
    );
    setter(res?.data?.isAmountBase);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
  }
};
