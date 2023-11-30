import axios from "axios";
import { imarineBaseUrl } from "../../../../App";
import { toast } from "react-toastify";

export const getASLLAgencyBill = async (
  typeId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  setter([]);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetASLLAgencyBill?typeId=${typeId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const createShippingAgencyJVApi = async ({
  customerId,
  customerName,
  vesselId,
  vesselName,
  voyageNo,
  amount,
  fromDate,
  toDate,
  setLoading,
  cb
}) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/fino/AdjustmentJournal/CreateShippingAgencyJV?customerId=${customerId}&customerName=${customerName}&vesselId=${vesselId}&vesselName=${vesselName}&voyageNo=${voyageNo}&amount=${amount}&fromDate=${fromDate}&toDate=${toDate}`
    );
    toast.success(res.data?.message || "Submitted successfully");
    cb()
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Submitted failed');
    setLoading(false);
  }
};
