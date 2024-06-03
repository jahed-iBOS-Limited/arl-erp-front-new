import * as Yup from "yup";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
  isTransfer: "",
  transferBusinessUnit: "",
  businessTransaction: "",
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
  referenceDate:  _todayDate(),
  validity:  _todayDate(),
  otherTerms: "",
  referenceNo: "",
  item: "",
  deliveryDate: _todayDate(),
  isAllItem: false,
  othersCharge: ""
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
  // incoterms: Yup.object().shape({
  //   label: Yup.string().required("Incoterm is required"),
  //   value: Yup.string().required("Incoterm is required"),
  // }),
  
  validity: Yup.date().required("Validity date is required"),
  
});

// all input fields : this function will set our all input fields  , then we will use loop to generate input fields in UI
export const setInputFieldsFunc = (setInputFields, storeData) => {
  const {
    currencyDDL,
    paymentTermsDDL,
    incoTermsDDL,
  } = storeData;

  // type 1 means ddl, 2 means text box , 3 means date

  setInputFields([
    {
      label: "Delivery address",
      name: "deliveryAddress",
      type: 2,
    },
    {
      label: "Order date",
      name: "orderDate",
      type: 3,
      disabled: true
    },
    {
      label: "Last shipment date",
      name: "lastShipmentDate",
      type: 3,
    },
    {
      label: "Currency",
      name: "currency",
      type: 1,
      options: currencyDDL,
      dependencyFunc: (currentValue, values, setter, label) => {},
    },
    {
      label: "Payment terms",
      name: "paymentTerms",
      type: 1,
      options: paymentTermsDDL,
      dependencyFunc: (currentValue, values, setter, label) => {},
    },
    {
      label: "Cash/Advance (%)",
      name: "cash",
      type: 2,
      isNum: true,
    },
    {
      label: "Pay days (After MRR)",
      name: "payDays",
      type: 2,
      isNum: true,
    },
    {
      label: "Incoterm",
      name: "incoterms",
      type: 1,
      disabled: true,
      options: incoTermsDDL,
      dependencyFunc: (currentValue, values, setter, label) => {},
    },
    {
      label: "Supplier reference",
      name: "supplierReference",
      type: 2,
    },
    {
      label: "Reference date",
      name: "referenceDate",
      type: 3,
    },
    {
      label: "Validity",
      name: "validity",
      type: 3,
    },
  ]);
};

