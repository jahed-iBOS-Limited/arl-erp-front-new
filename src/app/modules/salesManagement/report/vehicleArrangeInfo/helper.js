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
  type,
  providerTypeId
) => {
  const detailsAPI = `/oms/SalesOrganization/GetTransportScheduleTypeData?AccountId=${accId}&BusinessUnitId=${buId}&ProviderTypeId=${providerTypeId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=0&PageSize=10000&ShippointId=${shipPointId}`;

  const url = detailsAPI;

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
      `/oms/SalesInformation/CreateEMailToVehicleProvider`,
      // `/oms/SalesOrganization/CreateVehicleProviderConfirmationInfo`,
      data
    );
    cb();
    toast.success(res?.data?.message || "Submitted Successfully!");
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
  if (!providerTypeId) {
    return toast.warn("Please select logistic By");
  }

  const url = `/oms/SalesOrganization/VehicleProviderConfirmationInfoPagination?BusinessUnitId=${buId}&ProviderTypeId=${providerTypeId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=0&PageSize=1000000&ShippointId=${shipPointId}
  `;

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
