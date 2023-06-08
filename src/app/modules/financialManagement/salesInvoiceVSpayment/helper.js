import Axios from "axios";
import { toast } from "react-toastify";

// create
export const CreateSalesInvoiceDetails = async (payload) => {
  try {
    const res = await Axios.post(
      `/oms/OManagementReport/CreateSalesInvoiceDetails`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// get data by single id
export const GetSalesInvoiceByBillNo = async (billNo, setter) => {
  try {
    const res = await Axios.get(
      `/oms/OManagementReport/GetSalesInvoiceByBillNo?SalesInvoiceId=${billNo?.value}`
    );
    console.log(res);
    if (res.status === 200) {
      toast.success(res?.data?.message);
      setter(res?.data);
    }
  } catch (error) {}
};
