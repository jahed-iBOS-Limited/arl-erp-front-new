import axios from "axios";
import { toast } from "react-toastify";

export const mode = [
  { value: 1, label: "Company" },
  { value: 2, label: "Supplier" },
];
export const carType = [
  { value: 1, label: "Open" },
  { value: 2, label: "Covered" },
];
export const bagType = [
  { value: 1, label: "Sewing" },
  { value: 2, label: "Pasting" },
  { value: 3, label: "MES OPC" },
  { value: 4, label: "MES PCC" },
];
export const deliveryMode = [
  { value: 1, label: "Day" },
  { value: 2, label: "Night" },
];

export const getDeliveryChallanInfoById = async (
  id,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/ShopBySales/GetDeliveryOpenChallanByDeliveryId?DeliveryId=${id}`
    );
    setter(res?.data[0]);
    cb();
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const printCount = async (accId, buId, id) => {
  try {
    await axios.put(
      `/wms/ShopBySales/SetPrintCount?AccountId=${accId}&BusinessUnitId=${buId}&DeliveryId=${id}`
    );
  } catch (error) {
    console.log(error);
  }
};
