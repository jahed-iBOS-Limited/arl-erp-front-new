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

export const getCustomerListDDL = async (
  accId,
  buId,
  sbuId,
  saleOrgId,
  shipPointId,
  channelId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerForSalesOrderDDL?accountId=${accId}&businessUnitId=${buId}&Sbuid=${sbuId}&SalesOrg=${saleOrgId}&ShipPoint=${shipPointId}&DistributionChannel=${channelId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getShipPointist = async (userId, clientId, buId, setter) => {
  try {
    const res = await axios.get(
      `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${clientId}&BusinessUnitId=${buId}`
    );
    const newData = res?.data?.map((data) => {
      return {
        ...data,
        label: data?.organizationUnitReffName,
        value: data?.organizationUnitReffId,
        address: data?.address,
      };
    });
    setter(newData);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
  }
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

export const CastingScheduleEntrySaveAPI = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/CastingSchedule/CreateCastingSchedule`,
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

export const CastingScheduleEntryEditAPI = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/CastingSchedule/EditCastingSchedule`,
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

export const getCastingEntryList = async (
  buId,
  values,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/CastingSchedule/GetCastingScheduleAllData?FromDate=${
        values?.fromDate
      }&ToDate=${values?.toDate}&BusinessUnitId=${buId}&ShippingpointId=${
        values?.shipPoint?.value
      }&StatusId=${-1}&PageSize=${pageSize}&PageNo=${pageNo}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getCastingEntryById = async (
  id,
  setter,
  setLoading,
  setRowData
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/CastingSchedule/GetCastingScheduleById?id=${id}`
    );
    let header = res?.data?.header;
    let castingDateTime = header?.dteCastingDate.slice(0, -3);
    const payload = {
      ...header,
      dteDemandDate: _dateFormatter(header?.dteDemandDate),
      dteInformationDate: _dateFormatter(header?.dteInformationDate),
      dteCastingDate: castingDateTime,
      customer: {
        value: header?.intCustomerId,
        label: header?.strCustomerName,
      },
      workType: {
        value: header?.intWorkTypeId,
        label: header?.strWorkTypeName,
      },
      shipPoint: {
        value: header?.intShippingPointID,
        label: header?.strShippingPointName,
      },
      castingProcedure: {
        value: header?.intCastingProcedureBy,
        label: header?.strCastingProcedureBy,
      },
    };
    setter(payload);
    setRowData(res?.data?.row);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const deleteCastingSchedule = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/CastingSchedule/DeleteCastingSchedule?id=${id}`
    );

    toast.success(res?.data?.message || "Delete Casting Schedule");
    cb();
    setLoading(false);
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setLoading(false);
  }
};
