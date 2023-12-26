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

export const getRegionList = async (buId,userId,channelId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(`/oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL?businessUnitId=${buId}&userId=${userId}&typeName=region&distributionChannelId=${channelId}`);
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

export const getAreaList = async (buId,userId,regionId, channelId,setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL?businessUnitId=${buId}&userId=${userId}&typeName=Area&regionId=${regionId}&distributionChannelId=${channelId}`
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
      `/oms/TargetNProductQty/GetTargetLiftQty?itemid=${itemId}&monthid=${monthId}&targrtYear=${yearId}&entryTypeId=${entryTypeId}&areaid=${areaId}&statusId=0`
    );

    const lookup = {};
    for (let item of res?.data) {
      let formatDate = `${_dateFormatter(item?.dteFromDate)}`;
      if (!lookup[formatDate]) lookup[formatDate] = item;
      else {
        lookup[formatDate] = {
          ...item,
          numTargetQuantity:
            lookup[formatDate]?.numTargetQuantity + item?.numTargetQuantity,
        };
      }
    }

    setLoading(false);
    return lookup;
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

    const modifyData = dateListOfTheMonth?.map((item) => {
      if (resGetSavedTargetQtyData[item]) {
        const {
          numTargetQuantity,
          strRemarks,
          intId,
          isApprove,
        } = resGetSavedTargetQtyData[item];

        return {
          intId,
          date: item,
          avgTargetQty: avgQty || 0,
          liftingQty: numTargetQuantity || 0,
          remarks: strRemarks || "",
          totalTarget: res?.data[0]?.targetQuantity || 0,
          areaName: res?.data[0]?.nL6 || "",
          areaId: res?.data[0]?.l6 || 0,
          isSelected: numTargetQuantity > 0 ? true : false,
          isApprove: isApprove,
        };
      }

      return {
        date: item,
        avgTargetQty: avgQty,
        liftingQty: 0,
        remarks: "",
        totalTarget: res?.data[0]?.targetQuantity,
        areaName: res?.data[0]?.nL6,
        areaId: res?.data[0]?.l6,
        isSelected: false,
        isApprove: false,
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

export const liftingEntryAPI = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/TargetNProductQty/CreateLiftingQty`,
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

export const liftingEntryEditAPI = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/TargetNProductQty/EditLiftingQty`,
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

export const getLiftingEntryList = async (
  date,
  buId,
  channelId,
  areaId,
  productId,
  reportTypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetLiftingPlanReport?firstDate=${date}&businessId=${buId}&channelId=${channelId}&areaId=${areaId}&productId=${productId}&reportTypeId=${reportTypeId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const getLiftingEntryLists = async (
  date,
  buId,
  channelId,
  levelid,
  areaId,
  productId,
  reportTypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetLiftingPlanReport?firstDate=${date}&businessId=${buId}&channelId=${channelId}&areaId=${areaId}&productId=${productId}&reportTypeId=${reportTypeId}&levelid=${levelid}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetEmployeeLoginInfo_api = async (accId, buId, empId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
