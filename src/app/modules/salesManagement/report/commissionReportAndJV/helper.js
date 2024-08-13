import axios from "axios";
import { toast } from "react-toastify";

export const getCommissionReport = async (
  accId,
  buId,
  monthId,
  yearId,
  typeId,
  actionBy,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/WmsReport/CommisionReportAndJVGet?AccountId=${accId}&BusinessUnitId=${buId}&MonthId=${monthId}&YearId=${yearId}&ActionBy=${actionBy}&Type=${typeId}`
    );
    setter(res?.data?.map((item) => ({ ...item, isSelected: false })));
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getCommissionStatus = async (
  buId,
  monthId,
  yearId,
  typeId,
  status,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesOrder/GetMonthlyCommissionStatus?businessUnitId=${buId}&CommissionTypeId=${typeId}&MonthId=${monthId}&YearId=${yearId}&status=${status}`
    );
    setter(res?.data?.map((item) => ({ ...item, isSelected: false })));
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const createJV = async (
  payload,
  accId,
  buId,
  monthId,
  yearId,
  typeId,
  actionBy,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/wms/WmsReport/CommisionReportAndJVPost?AccountId=${accId}&BusinessUnitId=${buId}&MonthId=${monthId}&YearId=${yearId}&ActionBy=${actionBy}&Type=${typeId}`,
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

export const getTradeCommissionData = async (
  typeId,
  accId,
  buId,
  channelId,
  regionId,
  areaId,
  fromDate,
  toDate,
  actionBy,
  commissionRate,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetCommissionCalculation?Type=${typeId}&AccountId=${accId}&BusinessUnitID=${buId}&Actionby=${actionBy}&tradecommissionRate=${commissionRate}&dteFromDate=${fromDate}&dteToDate=${toDate}&ChannelId=${channelId}&RegionId=${regionId}&Areaid=${areaId}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        isEdit: false,
        tempCom: item?.commissiontaka,
        constCom: item?.commissiontaka,
        rowNarration: "",
      }))
    );
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const createTradeCommissionJV = async (payload, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/oms/SalesInformation/CreateCustomerCommissionEntry`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
export const createTradeForeinJV = async (payload, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/oms/SalesInformation/CreateForeignTourCommissionJv`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
export const createTradeDamageJV = async (payload, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/oms/SalesInformation/DamageCommisionEntry`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const cancelJV = async (typeId, monthId, yearId, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/oms/SalesOrder/GetMonthlyCommissionStatusUpdate?CommissionTypeId=${typeId}&MonthId=${monthId}&YearId=${yearId}`
    );
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
