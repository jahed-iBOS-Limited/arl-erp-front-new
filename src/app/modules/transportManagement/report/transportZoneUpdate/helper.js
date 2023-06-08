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
export const getransportZoneDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/tms/TransportZone/GetTransportZoneDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
    toast.warning(err?.response?.data?.message);
  }
};
export const GetSupplierAndVehicleInfo_api = async (
  type,
  buId,
  code,
  shipmentId,
  customerId,
  userId,
  transportZoneId,
  remarks,
  setter,
  setLoading,
  isUpdateMassage
) => {
  setLoading(true);
  const isRemarks = remarks ? `&Reasons=${remarks}` : ""
  try {
    let res = await Axios.get(
      `/oms/SalesInformation/GetTransportzoneInformationforzonechange?PartID=${type}&UnitID=${buId}&Delivercode=${code}&ShippingPoint=${shipmentId}&Customerid=${customerId}&UpdateBy=${userId}&Transportzoneid=${transportZoneId}${isRemarks}`
    );
    if (isUpdateMassage) {
      toast.success("Submitted successfully");
      setter([]);
      setLoading(false);
      return false;
    }

    if (res?.data?.length === 0) toast.warning("Data Not Found");
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    setter([]);
  }
};
