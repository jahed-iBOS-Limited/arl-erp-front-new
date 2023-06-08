import Axios from "axios";
import { toast } from "react-toastify";

export const GetCustomerDeliveryInqueryLanding_api = async (
  date,
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search
) => {
  setLoading && setLoading(true);
  try {
    const searchPath = search ? `search=${search}&` : "";
    const res = await Axios.get(
      `/wms/CustomerDeliveryInquery/GetCustomerDeliveryInqueryLanding?AccountId=${accId}&BusinessUnitid=${buId}&date=${date}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {}
  setLoading && setLoading(false);
};

export const GetDeliveryStatusReport_api = async (
  accId,
  buId,
  deliveryId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/wms/WmsReport/GetDeliveryStatusReport?AccountId=${accId}&BusinessUnitId=${buId}&DeliveryId=${deliveryId}`
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {}
  setLoading && setLoading(false);
};

export const CreateDailyDeliveryStatus_api = async (data, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/wms/CustomerDeliveryInquery/CreateDailyDeliveryStatus`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    console.log("object");
    toast.error(error?.response?.data?.message || "Something went wrong");
    setDisabled(false);
  }
};
