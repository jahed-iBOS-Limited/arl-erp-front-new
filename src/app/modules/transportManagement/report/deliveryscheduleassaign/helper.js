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
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/Delivery/GetDeliverySchedulePlan?accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDtae=${toDate}&shipmentType=${shipmentType}&shippointId=${shippointId}&isCompleted=${isCompleted}`
    );
    const modifid = res?.data?.map((item) => ({
      ...item,
      itemCheck: false,
    }));
    cb(modifid);
    setLoading(false);
  } catch (error) {
    cb([]);
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

export const commonfilterGridData = (values, allGridData) => {
  // filter grid data by region, area, territory but is field not mendatory
  const filterGridData = allGridData?.filter((itm) => {
    itm.itemCheck = false;
    let regionFilter =
      values?.region?.label === "All"
        ? true
        : itm?.region === values?.region?.label;
    let areaFilter =
      values?.area?.label === "All" ? true : itm?.area === values?.area?.label;
    let territoryFilter =
      values?.territory?.label === "All"
        ? true
        : itm?.territory === values?.territory?.label;

    let logisticByFilter =
      values?.logisticByFilter?.label === "All"
        ? true
        : itm?.providerTypeName === values?.logisticByFilter?.label;
    if (
      values?.region?.label &&
      values?.area?.label &&
      values?.territory?.label
    ) {
      return regionFilter && areaFilter && territoryFilter && logisticByFilter;
    } else if (values?.region?.label && values?.area?.label) {
      return regionFilter && areaFilter && logisticByFilter;
    } else if (values?.region?.label) {
      return regionFilter && logisticByFilter;
    } else {
      return logisticByFilter;
    }
  });
  return filterGridData;
};
