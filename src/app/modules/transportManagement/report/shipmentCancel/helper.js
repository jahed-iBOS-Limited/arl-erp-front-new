import Axios from "axios";
import { toast } from "react-toastify";

export const getDistributionChannelDDL_api = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const DeliveryChallanInformation_api = async (
  reportType,
  buId,
  code,
  date,
  userId,
  customerid,
  setter,
  setLoading,
  isUpdateMassage,
  resetForm
) => {
  setLoading(true);
  try {
    let res = await Axios.get(
      `/oms/SalesInformation/GetDeliveryChallanInformation?PartID=${reportType}&UnitID=${buId}&Delivercode=${code}&TransferToDate=${date}&UpdateBy=${userId}&Customerid=${customerid}`
    );
    if (isUpdateMassage) {
      toast.success("Submitted successfully");
      setter([]);
      setLoading(false);
      resetForm();
      return false;
    }
    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    toast.warn(err?.response?.data?.message || "Something went wrong");
    setLoading(false);
    setter([]);
  }
};
export const GetInfoForChalalnCancell_api = async (
  buId,
  code,
  remarks,
  userId,
  customerid,
  setter,
  setLoading,
  resetForm
) => {
  setLoading(true);
  try {
    let res = await Axios.get(
      `/oms/SalesInformation/GetInformationForChalalnCancell?Delivercode=${code}&UnitID=${buId}&PartID=3&Narration=${remarks}&InactiveBy=${userId}&Customerid=${customerid}`
    );
    toast.success(res?.message || "Submitted successfully");
    setter([]);
    setLoading(false);
    resetForm();
  } catch (err) {
    toast.warn(err?.response?.data?.message || "Something went wrong");
    setLoading(false);
    setter([]);
  }
};

export const EditVehicleAndSupplierInfo_api = async (
  payload,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/Shipment/EditVehicleAndSupplierInfo`,
      payload
    );
    cb();
    setLoading(false);
    toast.success(res?.data?.message || "Successfully");
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const getPermissionForShipmentModification = async (
  userId,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesInformation/GetAllowForModification?Partid=1&UserId=${userId}&UnitId=${buId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
