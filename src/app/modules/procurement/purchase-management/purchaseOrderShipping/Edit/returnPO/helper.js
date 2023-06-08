import Axios from "axios";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
  //header
  supplierName: "",
  deliveryAddress: "",
  orderDate: "",
  lastShipmentDate: "",
  currency: "",
  paymentTerms: "",
  cash: "",
  payDays: "",
  incoterms: "",
  supplierReference: "",
  referenceDate: "",
  validity: "",
  returnDate: _todayDate(),
  otherTerms: "",

  // row
  referenceNo: "",
  item: "",
  isAllItem: false,
};

// Validation schema
export const validationSchema = Yup.object().shape({
  supplierName: Yup.object().shape({
    label: Yup.string().required("Supplier name is required"),
    value: Yup.string().required("Supplier name is required"),
  }),
  // deliveryAddress: Yup.string().required("Delivery address is required"),
  // orderDate: Yup.date().required("Order date is required"),
  // lastShipmentDate: Yup.date().required("Last shipment date is required"),
  // currency: Yup.object().shape({
  //   label: Yup.string().required("Currency is required"),
  //   value: Yup.string().required("Currency is required"),
  // }),
  // paymentTerms: Yup.object().shape({
  //   label: Yup.string().required("Payment terms is required"),
  //   value: Yup.string().required("Payment terms is required"),
  // }),
  //
  // payDays: Yup.number().required("Pay days is required"),
  // incoterms: Yup.object().shape({
  //   label: Yup.string().required("Incoterm is required"),
  //   value: Yup.string().required("Incoterm is required"),
  // }),
  // supplierReference: Yup.string().required("Supplier reference is required"),
  // referenceDate: Yup.date().required("Reference date is required"),
  // validity: Yup.date().required("Validity date is required"),
});

export const getReturnPOInfoById = async (poIdRefId, setFieldValue) => {
  
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPurchaseOrderInformationByPO_Id?PurchaseOrderId=${poIdRefId}`
    );
    if (res.status === 200 && res?.data) {
      const { objHeaderDTO } = res?.data[0];
     
      setFieldValue("deliveryAddress",  objHeaderDTO?.deliveryAddress);
      // setFieldValue("returnDate", objHeaderDTO?.returnDate);
      setFieldValue("payDays", objHeaderDTO?.paymentDaysAfterDelivery);
      setFieldValue("cash", objHeaderDTO?.cashOrAdvancePercent);
      setFieldValue("supplierReference", objHeaderDTO?.supplierReference);
      setFieldValue(
        "referenceDate",
        objHeaderDTO?.referenceDate
          ? _dateFormatter(objHeaderDTO?.referenceDate)
          : ""
      );
      setFieldValue(
        "returnDate",
        objHeaderDTO?.returnDate
          ? _dateFormatter(objHeaderDTO?.returnDate)
          : ""
      );
      
      setFieldValue(
        "validity",
        objHeaderDTO?.validityDate
          ? _dateFormatter(objHeaderDTO?.validityDate)
          : ""
      );
      setFieldValue(
        "orderDate",
        objHeaderDTO?.purchaseOrderDate
          ? _dateFormatter(objHeaderDTO?.purchaseOrderDate)
          : ""
      );
      setFieldValue(
        "lastShipmentDate",
        objHeaderDTO?.lastShipmentDate
          ? _dateFormatter(objHeaderDTO?.lastShipmentDate)
          : ""
      );
      setFieldValue("currency", {
        value: objHeaderDTO?.currencyId,
        label: objHeaderDTO?.currencyCode,
      });
      setFieldValue("paymentTerms", {
        value: objHeaderDTO?.paymentTerms,
        label: objHeaderDTO?.paymentTermsName,
      });
      setFieldValue("incoterms", {
        value: objHeaderDTO?.incotermsId,
        label: objHeaderDTO?.incotermsName,
      });
    }
  } catch (error) {
    
  }
};
