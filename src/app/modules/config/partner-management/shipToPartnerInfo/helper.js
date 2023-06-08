import axios from "axios";
import { toast } from "react-toastify";

export const getShipToPartnerInformation = async (
  reportType,
  shipToPartner,
  businessPartner,
  territory,
  area,
  region,
  channel,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetShipToPartnerList?Partid=${reportType}&ShiptoPartnerId=${shipToPartner}&BusinessPartnerId=${businessPartner}&TerritoryId=${territory}&AreaId=${area}&RegionId=${region}&DistributionChannelId=${channel}&UnitId=${buId}`
    );
    if (res?.length === 1) {
      toast.warn("Data Not Found");
    } else {
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          itemCheck: false,
        }))
      );
    }
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

export const getRegionAreaTerritoryDDL = async (
  accId,
  buId,
  typeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetTerritoryandType?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryTypeId=${typeId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getTransportZoneDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const GetEmployeeLoginInfo_api = async (accId, buId,empId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const updateTransportZone = async (data, setLoading, callback) => {
  setLoading(true);
  try {
    const res = await axios.put(`/oms/Shipment/EditShipToPartnerZone`, data);
    toast.success(res?.data?.message);
    callback();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getBusinessPartnerByEmployeeId = async (
  accId,
  buId,
  empId,
  setter
) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerSales/GetBusinessPartnerByEmployeeId?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    setter(
      res?.data?.map((itm) => ({
        ...itm,
        value: itm?.businessPartnerId,
        label: `${itm?.businessPartnerName}(${itm?.businessPartnerCode})`,
      }))
    );
  } catch (error) {
    setter([]);
  }
};

export const getOperationalZoneInfo = async (partnerId, setter) => {
  try {
    const res = await axios.get(
      `/partner/PartnerInformation/GetOperationalZoneInfo?soldToPartnerId=${partnerId}`
    );
    setter(
      res?.data?.map((itm) => ({
        ...itm,
        value: itm.l8Id,
        label: itm.zonename,
      }))
    );
  } catch (error) {
    setter([]);
  }
};

export const shiptopartnerOperationalZoneSave = async (
  payload,
  setDisabled,
  cb
) => {
  try {
    const res = await axios.post(
      "/partner/PartnerInformation/CreateShiptopartnerOperationalZone",
      payload
    );

    toast.success(res?.data?.message || "Submitted Successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setDisabled(false);
  }
};
