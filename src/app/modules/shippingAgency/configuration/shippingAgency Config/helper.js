import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";

export const shippingAgencyValidation = Yup.object().shape({
  vesselType: Yup.object().shape({
    label: Yup.string().required("Vessel Type is required"),
    value: Yup.string().required("Vessel Type is required"),
  }),
  vessel: Yup.object().shape({
    label: Yup.string().required("Vessel is required"),
    value: Yup.string().required("Vessel is required"),
  }),
  transferCostCenter: Yup.object().shape({
    label: Yup.string().required("Transfer Cost Center is required"),
    value: Yup.string().required("Transfer Cost Center is required"),
  }),
  costElement: Yup.object().shape({
    label: Yup.string().required("Cost Element is required"),
    value: Yup.string().required("Cost Element is required"),
  }),
  transferBusinessUnit: Yup.object().shape({
    label: Yup.string().required("Transfer Business Unit is required"),
    value: Yup.string().required("Transfer Business Unit is required"),
  }),
  profitCenter: Yup.object().shape({
    label: Yup.string().required("Profit Center is required"),
    value: Yup.string().required("Profit Center is required"),
  }),
  transferProfitCenter: Yup.object().shape({
    label: Yup.string().required("Transfer Profit Center is required"),
    value: Yup.string().required("Transfer Profit Center is required"),
  }),
  businessTransaction: Yup.object().shape({
    label: Yup.string().required("Business Transaction is required"),
    value: Yup.string().required("Business Transaction is required"),
  }),
  revenueCenter: Yup.object().shape({
    label: Yup.string().required("Revenue Center is required"),
    value: Yup.number().required("Revenue Center is required"),
  })
  .typeError("Revenue is required"),
  
  revenueElement: Yup.object().shape({
    label: Yup.string().required("Revenue Element is required"),
    value: Yup.string().required("Revenue Element is required"),
  }),
});

export const getLandingData = async (
  setLoading,
  setter,
  buId,
  vesselTypeId,
  vesselId,
  fromDate,
  toDate,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetShippingAgencyConfig?businessUnitId=${buId}&vesselTypeId=${vesselTypeId}&vesselId=${vesselId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const getVesselTypeDDL = async (setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetVesselTypeDDL`
    );
    setter(res.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const getVesselDDL = async (buId, accId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const createShippingAgency = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/CreateShippingAgencyConfig`,
      payload
    );

    toast.success("Submitted Successfully");
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const updateShippingAgency = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/EditShippingAgencyConfig`,
      payload
    );

    toast.success("Submitted Successfully");
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const deleteShipAgency = async (id, buId, setLoading, cb) => {
  try {
    setLoading(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/DeleteShippingAgencyConfig?businessUnitId=${buId}&id=${id}`
    );
    toast.success("Deleted Successfully");
    cb();
    setLoading(false);
  } catch (error) {
    console.log("error", error);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
