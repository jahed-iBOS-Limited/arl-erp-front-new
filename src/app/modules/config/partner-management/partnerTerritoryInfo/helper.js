import axios from "axios";
import { toast } from "react-toastify";

export const getPartnerTerritoryInformation = async (
  accId,
  buId,
  channelId,
  status,
  userId,
  search,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  const searchValue = search ? `&search=${search}` : "";
  try {
    const res = await axios.get(
      `/partner/PartnerTerritoryInfo/GetPartnerTerritoryInfoLanding?AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}&UserId=${userId}${searchValue}&pageNo=${pageNo}&pageSize=${pageSize}&vieworder=desc&terrtorystatus=${status}`
    );
    if (res?.data?.data?.length < 1) {
      toast.warn("Data Not Found");
    } else {
      setter(res?.data);
    }

    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

export const getPartnerTerritoryInfoById = async (id, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/partner/PartnerTerritoryInfo/GetPartnerTerritoryInfoById?ConfigId=${id}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

export const getTerritoryList = async (accId, buId, channelId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerSales/GetRTMTerritory?AccountId=${accId}&BusniessUnitId=${buId}&ChannelId=${channelId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const updatePartnerTerritory = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/partner/PartnerTerritoryInfo/UpdatePartnerTerritory`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getBusinessPartnersWithoutTerritory = async (
  accId,
  buId,
  search,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  const searchValue = search ? `&Search=${search}` : "";
  try {
    const res = await axios.get(
      `/partner/PartnerTerritoryInfo/getNotBusinessPartnerTerritory?accountid=${accId}&businessid=${buId}${searchValue}&pageNo=${pageNo}&pageSize=${pageSize}&vieworder=desc`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const updateTerritory = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/partner/PartnerTerritoryInfo/createPartnerTerritory`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
