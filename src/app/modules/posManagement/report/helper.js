import Axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

export const getSalesReportData = async (
  whId,
  buId,
  fromDate,
  toDate,
  reportTypeId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/partner/Pos/GetPOSSalesReport?reportTypeId=${reportTypeId}&businessUnitId=${buId}&warehouseId=${whId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getSalesProfitReportData = async (
  whId,
  accId,
  buId,
  fromDate,
  toDate,
  reportTypeId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/partner/Pos/GetNetProfitByWarehouse?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&WarehouseId=${whId}&ReportType=${reportTypeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
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
    const res = await Axios.get(
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

export const getDateWiseDeliveryReportData = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/OMSPivotReport/GetPosDeliveryInfo?AccountId=${accId}&Businessunitid=${buId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      const responseData = await res?.data.map((itm) => {
        return {
          deliveryDates: moment(itm?.deliveryDate).format("L"),
          ...itm,
        };
      });
      if (res?.data?.length > 0) {
        setter(responseData);
      } else {
        toast.warning("No Data Found");
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getWareHouseDDL = async (
  accountId,
  businessUnitId,
  userId,
  setter
) => {
  try {
    const res = await Axios.get(
      // `/wms/Warehouse/GetWarehouseDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${businessUnitId}&PlantId=68&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

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
    const res = await Axios.get(
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

export const getMonthlySalesReport = async (reportType, payload, setter) => {
  try {
    const res = await Axios.post(
      `/partner/Pos/GetMonthlySalesInfo?ReportType=${reportType}`,
      payload
    );
    let dataByOutletCategory = {};
    for (let { outletName, ...otherProps } of res?.data) {
      if (outletName in dataByOutletCategory) {
        dataByOutletCategory[outletName].value.push(otherProps);
      } else {
        dataByOutletCategory[outletName] = { outletName, value: [otherProps] };
      }
    }
    const response = Object.values(dataByOutletCategory);
    setter(response);
  } catch (error) {
    setter([]);
  }
};

export const getOutletWiseDueReport = async (outletId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/partner/Pos/GetCashDueOutletWise?OutletId=${outletId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getWarehouseDDL = async (
  accountId,
  businessUnitId,
  userId,
  setter
) => {
  try {
    const res = await Axios.get(
      // `/wms/Warehouse/GetWarehouseDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${businessUnitId}&PlantId=68&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const getEmployeeSubLedgerData = async (
  empId,
  fromDate,
  toDate,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/Pos/GetEmployeeSubledger?FromDate=${fromDate}&ToDate=${toDate}&EmployeeId=${empId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const getCashBookData = async (
  fromDate,
  toDate,
  outletId,
  partId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/partner/Pos/GetCashBook?FromDate=${fromDate}&ToDate=${toDate}&OutletId=${outletId}&Partid=${partId}`
    );
    if (res.status === 200) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    toast.error(error.response.data.message);
    setLoading(false);
  }
};
