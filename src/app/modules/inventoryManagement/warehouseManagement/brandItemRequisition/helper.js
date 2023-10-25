import axios from "axios";
import { toast } from "react-toastify";

export const getCustomerSalesTarget = async (
  accId,
  buId,
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
      `/oms/TargetNProductQty/CustomersSalesTargetNLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&AreaId=0&RegionId=0&FromDate=${fromDate}&ToDate=${toDate}&channelId=${channelId}&vieworder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    const modifyData = res?.data?.objdata?.map((item) => {
      return {
        ...item,
        requisitionQty: item?.targetQuantity,
      };
    });
    setter({ ...res?.data, objdata: modifyData });
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const productRequisitionEntry = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/oms/TargetNProductQty/CreateTargetProductQty`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getProductionRequests = async (
  buId,
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
      `/oms/TargetNProductQty/getTargetProductQtyLanding?businessid=${buId}&fromdate=${fromDate}&todate=${toDate}&vieworder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const acceptProductionRequest = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/TargetNProductQty/ApproveTargetProductQty?intid=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const cancelProductionRequest = async (id, remarks, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/TargetNProductQty/DeclineTargetProductQty?id=${id}&remark=${remarks}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
