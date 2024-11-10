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

export const GetSupplierAndVehicleInfo_api = async (
  accId,
  buId,
  code,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    let res = await Axios.get(
      `/tms/Shipment/GetSupplierAndVehicleInfo?AccountId=${accId}&BusinessUnitId=${buId}&DeliveryCode=${code}`
    );
    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (err) {
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
