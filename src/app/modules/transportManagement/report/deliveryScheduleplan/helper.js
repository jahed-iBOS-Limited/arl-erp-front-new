import axios from "axios";
import { toast } from "react-toastify";

export const getDeliverySchedulePlan = async (
  accId,
  buId,
  fromDate,
  toDate,
  shipmentType,
  shippointId,
  isCompleted,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/Delivery/GetDeliverySchedulePlan?accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDtae=${toDate}&shipmentType=${shipmentType}&shippointId=${shippointId}&isCompleted=${isCompleted}`
    );
    setter(res?.data?.map((item) => ({ ...item, itemCheck: false })));
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetShipmentTypeApi = async (
  accId,
  buId,
  territoryId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/DeliveryRequisition/GetShipmentType?AccountId=${accId}&BusinessUnitId=${buId}&TerritoryId=${territoryId}`
    );

    const dataModify = res?.data?.map((item) => ({
      value: item?.shipmentTypeId,
      label: item?.shipmentType,
      extraRate: item?.extraRate || 0,
    }));
    setter([{ value: 0, label: "All" }, ...dataModify] || []);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};
export const CreateTransportScheduleTypeApi = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
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
