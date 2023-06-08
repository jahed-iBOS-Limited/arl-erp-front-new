import axios from "axios";
import { toast } from "react-toastify";

export const getShipToPartnerInfo = async (
  partnerId,
  channelId,
  regionId,
  areaId,
  territoryId,
  setter,
  tempSetter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/partner/PartnerInformation/GetShipToPartnerInfo?soldToPartnerId=${partnerId}&ChannelId=${channelId}&RegionId=${regionId}&AreaId=${areaId}&TerriotoryId=${territoryId}`
    );
    const data = res?.data?.map((itm) => ({ ...itm, itemCheck: false }));
    setter(data);
    tempSetter(
      res?.data?.map((itm) => ({ ...itm, itemCheck: false, isTemp: true }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    tempSetter([]);
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

export const shipToPartnerTransfer_api = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/partner/PartnerInformation/UpdateSoldToPartnerBase`,
      payload
    );
    toast.success(res?.data?.message || "Successfully updated");
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const shipToTransferZone_api = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/partner/PartnerInformation/UpdateShipToPartnerTransportZone`,
      payload
    );
    toast.success(res?.data?.message || "Successfully updated");
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
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

export const shipToPartnerInfoUpdate = async (payload, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/partner/PartnerInformation/UpdateShipToPartnerBasicInfo`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

// /tms/TransportZone/GetTransportZoneDDL?AccountId=1&BusinessUnitId=94&partnerFlag=true
