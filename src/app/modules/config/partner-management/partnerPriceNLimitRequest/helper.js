import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  customer: Yup.string().required("Customer Name is required"),
  address: Yup.string().required("Address is required"),
  contactPerson: Yup.string().required("Contact Person is required"),
  contactNumber: Yup.string().required("Contact Number is required"),
  paymentMode: Yup.string().required("Payment Mode is required"),
  creditLimitType: Yup.object().shape({
    value: Yup.string().required("Credit Limit Type is required"),
    label: Yup.string().required("Credit Limit Type is required"),
  }),
});

export const saveEditedPartnerPriceAndLimitRequest = async (
  payload,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/BusinessPartnerLimitNPriceApproval/EditBusinessPartnerLimitNPriceApproval`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getPartnerPriceAndLimitRequestById = async (
  id,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/BusinessPartnerLimitNPriceApproval/GetBusinessPartnerLimitNPriceApprovalById?id=${id}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const approveOrReject = async (payload, status, setLoading, cb) => {
  setLoading(true);
  const url = status
    ? `/oms/BusinessPartnerLimitNPriceApproval/ApproveBusinessPartnerLimitNPrice`
    : `/oms/BusinessPartnerLimitNPriceApproval/RejectBusinessPartnerLimitNPrice`;
  try {
    const res = await axios.put(url, payload);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
