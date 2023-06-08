import axios from "axios";
import { toast } from "react-toastify";

export const getItemVSForeignSaleOffice = async (
  channelId,
  orgId,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/ItemVsForeginSalesOffice?intdistributionchannelid=${channelId}&intsalesorganizationdid=${orgId}&intunitid=${buId}&intpartid=1`
    );
    setter(res?.data?.map((item) => ({ ...item, isSelected: false })));
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const createLocalAndForeignItemBridge = async (
  payload,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/item/ItemSales/CreateItemVsForeginSalesOffice`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getLocalVSForeignItemBridgeLandingData = async (
  accId,
  buId,
  salesOrgId,
  channelId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/item/ItemSales/GetItemVsForeignSalesOffice?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrgId=${salesOrgId}&DistributionChannel=${channelId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const inActiveLocalVSForeignItemBridge = async (
  payload,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/item/ItemSales/InactiveItemVsForeginSalesOffice`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
