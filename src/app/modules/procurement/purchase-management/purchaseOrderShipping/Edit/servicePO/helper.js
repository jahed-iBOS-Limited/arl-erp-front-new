import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
  isTransfer: "",
  transferBusinessUnit: "",
  supplierName: "",
  deliveryAddress: "",
  orderDate: _todayDate(),
  lastShipmentDate: _todayDate(),
  currency: "",
  paymentTerms: "",
  cash: "",
  payDays: "",
  incoterms: "",
  supplierReference: "",
  referenceDate: _todayDate(),
  validity: _todayDate(),
  otherTerms: "",
  referenceNo: "",
  item: "",
  controllingUnit: "",
  profitCenter: "",
  costCenter: "",
  costElement: "",
  costCenterTwo: "",
  costElementTwo: "",
  profitCenterTwo:"",
  othersCharge: "",
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  supplierName: Yup.object().shape({
    label: Yup.string().required("Supplier name is required"),
    value: Yup.string().required("Supplier name is required"),
  }),
  deliveryAddress: Yup.string().required("Delivery address is required"),
  orderDate: Yup.date().required("Order date is required"),
  lastShipmentDate: Yup.date().required("Last shipment date is required"),
  currency: Yup.object().shape({
    label: Yup.string().required("Currency is required"),
    value: Yup.string().required("Currency is required"),
  }),
  paymentTerms: Yup.object().shape({
    label: Yup.string().required("Payment terms is required"),
    value: Yup.string().required("Payment terms is required"),
  }),

  payDays: Yup.number().required("Pay days is required"),
  // incoterms: Yup.object().shape({
  //   label: Yup.string().required("Incoterm is required"),
  //   value: Yup.string().required("Incoterm is required"),
  // }),

  validity: Yup.date().required("Validity date is required"),
});

export const getControllingUnitDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetControllingUnit?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCostCenterDDL = async (accId, buId, setter) => {
  const url = `/procurement/PurchaseOrder/GetCostCenter?AccountId=${accId}&UnitId=${buId}`;
  try {
    const res = await Axios.get(url);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCostElementDDL = async (
  accId,
  buId,
  controllUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElement?AccountId=${accId}&UnitId=${buId}&ControllingUnitId=${controllUnitId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCostElementDDLTwo = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/CostElement?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getProfitCenterList = async (buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        value: item?.profitCenterId,
        label: item?.profitCenterName,
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};