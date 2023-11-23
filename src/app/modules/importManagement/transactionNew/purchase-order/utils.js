import { _todayDate } from "../../../_helper/_todayDate";
import IWarningModal from "../../../_helper/_warningModal";
import * as Yup from "yup";
import axios from "axios";
import { ValidatePoNo } from "./helper";

export const initData = {
  supplierName: "",
  deliveryAddress: "",
  orderDate: _todayDate(),
  lastShipmentDate: _todayDate(),
  currency: "",
  paymentTerms: "",
  incoTerm: "",
  supplierReferenc: "",
  PIDate: _todayDate(),
  validity: _todayDate(),
  freight: "",
  // grossDiscount: "",
  purchaseRequestNo: "",
  item: "",
  isAllItem: "",
  uom: "",
  amount: "",
  rate: "",
  quantity: "",
};

//validation scheme;
export const validationSchema = Yup.object().shape({
  deliveryAddress: Yup.string().required("Delivery Address is required"),
  paymentTerms: Yup.object().shape({
    value: Yup.string().required("Payment Terms is required"),
  }),

  supplierReference: Yup.string().required("Supplier Reference is required"),
  // purchaseRequestNo: Yup.string().required("Purchase Request is required"),
});

//set row data
export const setRowAmount = (key, index, amount, gridData, setRowDto) => {
  let data = [...gridData];
  data[index][key] = amount ? amount : "";
  data[index]["totalAmount"] = Number(
    +data[index].quantity * +data[index].rate
  )?.toFixed(2);
  setRowDto([...data]);
};

//searchable drop down in po list;
export const loadPartsList = (v) => {
  if (v?.length < 3) return [];
  return axios.get(``).then((res) => res?.data);
};

export const setter = (values, rowDto, setRowDto) => {
  let data = [...rowDto];
  let obj = {
    ...values?.item,
    uom: { value: values?.item?.uomId, label: values?.item?.uomName },
    // currency:
  };
  return setRowDto([...data, obj]);
};

//after creating po then message modal
export const Warning = (message) => {
  let confirmObject = {
    title: message,
    okAlertFunc: async () => {},
  };
  IWarningModal(confirmObject);
};

//check purchase request validation;
export const checkPurchaseRequestNo = (
  poNumber,
  setPurchaseRequestValidity,
  accountId,
  businessUnitId
) => {
  if (poNumber) {
    ValidatePoNo(
      accountId,
      businessUnitId,
      poNumber,
      setPurchaseRequestValidity
    );
  }
};
