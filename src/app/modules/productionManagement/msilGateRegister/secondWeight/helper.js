import axios from "axios";

export const getTransportStatusAndInfo = async (
    partId,
    buId,
    deliveryId,
    setter,
    loading
  ) => {
    loading(true);
    try {
      const res = await axios.get(
        `/oms/SalesInformation/sprTransportStatusByDeliveryId?intParid=${partId}&intBusinessUnitId=${buId}&PKID=${deliveryId}`
      );
      setter(res?.data);
      loading(false);
    } catch (error) {
      setter([]);
      loading(false);
    }
  };