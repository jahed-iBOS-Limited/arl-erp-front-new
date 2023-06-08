import Axios from "axios";

export const GetLandingData = async (
  buId,
  // assignedTo,
  deliveryMode,
  VehicleProvider,
  date,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/TMSReport/GetShipmentRequestReport?BusinessUnitId=${buId}&DeliveryMode=${deliveryMode}&VehicleProvider=${VehicleProvider}&date=${date}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
