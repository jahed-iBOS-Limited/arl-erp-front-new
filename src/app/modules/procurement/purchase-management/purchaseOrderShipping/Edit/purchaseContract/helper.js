import * as Yup from "yup";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
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
  itemGroup: "",
  contractType: "",
  validity: _todayDate(),
  otherTerms: "",
  referenceNo: "",
  item: "",
  deliveryDate: _todayDate(),
};

// Validation schema
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
  incoterms: Yup.object().shape({
    label: Yup.string().required("Incoterm is required"),
    value: Yup.string().required("Incoterm is required"),
  }),
 
  contractType: Yup.object().shape({
    label: Yup.string().required("Contract type is required"),
    value: Yup.string().required("Contract type is required"),
  }),
  validity: Yup.date().required("Validity date is required"),
  
});
