import axios from "axios";
import { toast } from "react-toastify";

export const getAssignedDeliveryVehicleProvider = async (
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
      `/wms/Delivery/GetAssignedDeliveryVehicleProvider?accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDtae=${toDate}&shipmentType=${shipmentType}&shippointId=${shippointId}&isCompleted=${isCompleted}`
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

export const saveAssignDeliveryVehicleSupplier = async (
  data,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/wms/Delivery/AssignDeliveryVehicleSupplier`,
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
export const updateAssingnedVehicleProvider = async (
  data,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/wms/Delivery/UpdateAssingnedVehicleProvider`,
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
