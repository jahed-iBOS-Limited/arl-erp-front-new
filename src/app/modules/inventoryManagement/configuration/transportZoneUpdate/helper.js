import axios from "axios";
import { toast } from "react-toastify";

export const updateTransportZone = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await axios.put(
      "/tms/TransportZone/UpdateTransportZoneByDeliveryCode",
      payload
    );
    setLoading(false);
    cb();
    toast.success(res?.data?.message || "Submitted Successfully");
  } catch (error) {
    setLoading(false);
    toast.error(
      error?.response?.data?.message || "Something went wrong, try again"
    );
  }
};

export const getZoneInfoByChallanCode = async (
  accId,
  buId,
  challanNo,
  setFieldValue
) => {
  try {
    const res = await axios.get(
      `/tms/TransportZone/GetShipToPArtnerByDeliveryCode?AccountId=${accId}&BusinessUnitId=${buId}&DeliveryCode=${challanNo}`
      // `/tms/TransportZone/GetShipToPArtnerByDeliveryCode?AccountId=2&BusinessUnitId=164&DeliveryCode=SD0620210000000004`
    );
    // setter(res?.data);
    const zoneInfo = res?.data;

    setFieldValue("shiptoPartyName", zoneInfo?.partnerName || "");
    setFieldValue("address", zoneInfo?.shippingAddress || "");
    setFieldValue("partner", {
      label: zoneInfo?.partnerName || "",
      value: zoneInfo?.partnerId || 0,
    });
    setFieldValue("transportZone", {
      label: zoneInfo?.zoneName || "",
      value: zoneInfo?.zoneId || 0,
    });
  } catch (error) {}
};
