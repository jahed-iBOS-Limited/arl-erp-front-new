import Axios from "axios";
import { toast } from "react-toastify";
export const getRegionAreaTerritory = async ({
  channelId,
  regionId,
  areaId,
  territoryId,
  setter,
  setLoading,
  value,
  label,
}) => {
  setLoading(true);
  const region = regionId ? `&regionId=${regionId}` : "";
  const area = areaId ? `&areaId=${areaId}` : "";
  const territory = territoryId ? `&TerritoryId=${territoryId}` : "";
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}${region}${area}${territory}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        value: item[value],
        label: item[label],
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
export const getDistributionChannelDDL_api = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};
export const getCustomersSalesTarget_Api = async (
  setLoading,
  setter,
  accId,
  buId,
  fromDate,
  toDate,
  chId,
  arId,
  regId,
  territoryId,
  type,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/CustomerSalesTarget/CustomersSalesTargetLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&channelId=${chId}&AreaId=${arId}&RegionId=${regId}&TerritoryId=${territoryId}&type=${type}&vieworder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );

    setter({
      ...res?.data,
      objdata: res?.data?.objdata?.map((item) => ({
        ...item,
        isEdit: false,
        editedTargetQuantity: item.targetQuantity,
      })),
    });
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const editSalesTarget = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/oms/CustomerSalesTarget/editCustomerTargetQuantity`,
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
