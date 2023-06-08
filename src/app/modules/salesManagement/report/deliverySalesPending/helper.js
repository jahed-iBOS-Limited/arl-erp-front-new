import Axios from "axios";
import { toast } from "react-toastify";

export const getOrderVsShipmentVsPending_api = async (
  accId,
  buId,
  fromDate,
  toDate,
  shipPointId,
  pageNo,
  pageSize,
  setLoading,
  setter,
  setGridDataTwo,
  type
) => {
  const detailsAPI = `/oms/SalesOrganization/GetOrderVsShipmentVsPending?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&ShippointId=${shipPointId ||
    0}`;

  const topSheetAPI = `/oms/SalesOrganization/GetOrderVsShipmentVsPendingTopSheet?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&ShippointId=${shipPointId ||
    0}`;
  const url = [1, 3]?.includes(type) ? topSheetAPI : detailsAPI;

  try {
    setLoading(true);
    const res = await Axios.get(url);
    setLoading(false);
    // 1= Top Sheet (Pending), 3= Top Sheet (Complete)
    if (type === 1) {
      const pendingData = res?.data?.filter(
        (item) => item?.pendingDeliveryqty > 0
      );
      setter(pendingData);
      setGridDataTwo(pendingData);
    } else if (type === 3) {
      const completedData = res?.data?.filter(
        (item) => item?.pendingDeliveryqty === 0
      );

      setter(completedData);
      setGridDataTwo(completedData);
    } else {
      //report type  (Details Id =2)
      setter({
        ...res?.data,
        data: res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })),
      });
      setGridDataTwo({
        ...res?.data,
        data: res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })),
      });
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const CreateTransportScheduleTypeApi = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/oms/SalesOrganization/CreateTransportScheduleType`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getTransportScheduleTypeData_api = async (
  accId,
  buId,
  fromDate,
  toDate,
  shipPointId,
  pageNo,
  pageSize,
  setLoading,
  setter,
  setGridDataTwo,
  providerTypeId
) => {
  const url = `/oms/SalesOrganization/GetTransportScheduleTypeData?AccountId=${accId}&BusinessUnitId=${buId}&ProviderTypeId=${providerTypeId ||
    0}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&ShippointId=${shipPointId}`;

  try {
    setLoading(true);
    const res = await Axios.get(url);
    setLoading(false);
    //report type  (Details Id =2)
    setter({
      ...res?.data,
      data: res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })),
    });
    setGridDataTwo({
      ...res?.data,
      data: res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })),
    });
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getShipmentForTransportPlanning = async (
  accId,
  buId,
  shipPointId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter,
  setGridDataTwo,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/Shipment/ShipmentPaginationForTransportPlanning?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${shipPointId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter({
      ...res?.data,
      data: res?.data?.data?.map((item) => ({ ...item, itemCheck: false })),
    });
    setGridDataTwo({
      ...res?.data,
      data: res?.data?.data?.map((item) => ({ ...item, itemCheck: false })),
    });
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
