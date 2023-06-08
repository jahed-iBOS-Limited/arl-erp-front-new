import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getAllDates = (month, year) => {
  const dates = [];
  let startDate = new Date(year, month, 1);
  let endDate = new Date(year, month + 1, 0);

  while (startDate <= endDate) {
    dates.push(_dateFormatter(startDate));
    startDate = new Date(startDate.setDate(startDate.getDate() + 1));
  }
  return dates;
};

export const getItemList = async (
  accId,
  buId,
  channelId,
  saleOrgId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(`/item/ItemSales/GetItemSalesByChannelAndWarehouseDDL?AccountId=${accId}&BUnitId=${buId}&DistributionChannelId=${channelId}&SalesOrgId=${saleOrgId}
    `);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getSalesOrgList = async (accId, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getRegionList = async (channelId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(`/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}
    `);
    setter(
      res?.data?.map((item) => ({
        value: item?.regionId,
        label: item.regionName,
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getAreaList = async (channelId, regionId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}&regionId=${regionId}`
    );
    setter(
      res?.data?.map((item) => ({ value: item?.areaId, label: item.areaName }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getSavedTargetQtyData = async (
  itemId,
  entryTypeId,
  monthId,
  yearId,
  areaId,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/TargetNProductQty/GetTargetLiftQty?itemid=${itemId}&monthid=${monthId}&targrtYear=${yearId}&entryTypeId=${entryTypeId}&areaid=${areaId}`
    );

    setLoading(false);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
    return {};
  }
};

export const getTargetQtyList = async (
  buId,
  itemId,
  entryTypeId,
  monthId,
  yearId,
  areaId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    // It will take all monthly previous saved data
    const resGetSavedTargetQtyData = await getSavedTargetQtyData(
      itemId,
      entryTypeId,
      monthId,
      yearId,
      areaId,
      setLoading
    );

    // It will take Avg Qty for item for a month
    const res = await axios.get(
      `/oms/TargetNProductQty/GetTargetQuantity?BusinessUnitId=${buId}&TargetMonth=${monthId}&TargetYear=${yearId}&AreaId=${areaId}`
    );

    const dateListOfTheMonth = getAllDates(monthId - 1, yearId);
    const avgQty = Number(
      (res?.data[0]?.targetQuantity / dateListOfTheMonth?.length).toFixed(2)
    );

    const modifyData = resGetSavedTargetQtyData?.map((item) => {
      return {
        intId: item?.intId,
        date: _dateFormatter(item?.dteFromDate),
        avgTargetQty: avgQty || 0,
        liftingQty: item?.numTargetQuantity || 0,
        remarks: item?.strRemarks || "",
        totalTarget: item?.numTargetQuantity || 0,
        areaName: item?.strNl6 || "",
        areaId: item?.intL6id || 0,
        isSelected: true,
      };
    });

    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const liftingEntryApproveApi = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/TargetNProductQty/ApproveTargetLiftingQty`,
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

export const getApproveLiftingEntryList = async (
  yearId,
  monthId,
  areaId,
  productId,
  reportTypeId,
  setter,
  setLoading,
  statusId
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/TargetNProductQty/GetApprovedTargetLiftQty?itemid=${productId}&monthid=${monthId}&targrtYear=${yearId}&entryTypeId=${reportTypeId}&areaid=${areaId}&statusId=${statusId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
