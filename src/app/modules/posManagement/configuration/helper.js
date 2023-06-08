// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";

// export const getWareHouseDDL = async (accId, buId, setter) => {
//   try {
//     const res = await axios.get(
// import Axios from "axios";
// import { toast } from "react-toastify";

export const getSalesReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  reportTypeId,
  pageNo,
  pageSize,
  setLoading,
  setter
) => {
  try {
    const res = await axios.get(
      `oms/OManagementReport/GetSalesReport?AccountId=${accId}&BusinessunitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&ReportTypeId=${reportTypeId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {

  }
};

export const getDeliveryReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/OMSPivotReport/GetDeliveryInfo?AccountId=${accId}&Businessunitid=${buId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("No Data Found");
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};


export const getWareHouseDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/Warehouse/GetWarehouseDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getItemDDL = async (
  accId,
  buId,
  whId,
  fromDate,
  toDate,
  salesRate,
  mrp,
  expiredDate,
  pageNo,
  pageSize,
  setter,
  setTotalCount,
  search
) => {
  try {
    const searchQuery = search ? `&SearchTerm=${search}` : ""
    const fromString = fromDate ? `&fromDate=${fromDate}` : ""
    const toString = toDate ? `&toDate=${toDate}` : ""
    const salesRateString = salesRate ? `&MinRate=${salesRate?.min}&MaxRate=${salesRate?.max}` : ""
    const mrpString = mrp ? `&MinMRP=${mrp?.min}&MaxMRP=${mrp?.max}` : ""
    const IsExpierDateSetedString = expiredDate ? `&IsExpierDateSeted=${expiredDate?.value}` : ""
    const res = await axios.get(
      `/item/ItemSales/GetItemSalesforPOS?AccountId=${accId}&BUnitId=${buId}&WarehouseId=${whId}${fromString}${toString}&pageSize=${pageSize}&pageNo=${pageNo}&viewOrder=desc${salesRateString}${mrpString}${IsExpierDateSetedString}${searchQuery}`
    );
    const response = await res?.data?.data.map(item => {
      return {
        rowId: item?.rowId,
        itemId: item?.value,
        itemName: item?.label,
        itemCode: item?.code,
        uomId: item?.uomId,
        uomName: item?.uomName,
        mrp: item?.mrp,
        salesRate: item?.rate,
        barCode: item?.barCode,
        referenceId: item?.referenceId,
        cogs: item?.cogs,
        expiredDate: item?.expiredDate,
        purchaseDate: item?.purchaseDate,
        purchaseQty: item?.purchaseQty,
      }
    })
    setter(response);
    setTotalCount(res?.data?.totalCount)
  } catch (error) {
    setter([]);
  }
};

export const updateItemProfile = async (payload) => {
  try {
    const res = await axios.post("/oms/POSDelivery/SetsalesItemProfileForPos", payload)
    if (res?.status === 200) {
      toast.success(res?.data?.message);
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message
    );
  }
}

export const getDamageReportData = async (
  accId,
  buId,
  whId,
  fromDate,
  toDate,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/POSDamageEntry/GetWareHouseWiseDamageReport?accountId=${accId}&businessUnitId=${buId}&WarehouseId=${whId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("No Data Found");
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};



