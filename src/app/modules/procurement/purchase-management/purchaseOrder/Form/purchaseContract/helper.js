import axios from "axios";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
  supplierName: "",
  deliveryAddress: "",
  orderDate: _todayDate(),
  // last shipment date will after 15 days of current
  lastShipmentDate: _dateFormatter(
    new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000)
  ),
  currency: "",
  paymentTerms: { value: 2, label: "Credit" },
  cash: "",
  payDays: "",
  incoterms: { value: 1, label: "CFR (Cost And Freight)" },
  supplierReference: "",
  referenceDate: _todayDate(),
  itemGroup: "",
  contractType: "",
  validity: _todayDate(),
  otherTerms: "",
  referenceNo: "",
  item: "",
  deliveryDate: _todayDate(),
  freight:"",
  discount:"",
  commision:""
};

//  Validation schema
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

  payDays: Yup.number().required("Pay days is required").min(1,"Minimum 1 days"),
  incoterms: Yup.object().shape({
    label: Yup.string().required("Incoterm is required"),
    value: Yup.string().required("Incoterm is required"),
  }),

  contractType: Yup.object().shape({
    label: Yup.string().required("Contract type is required"),
    value: Yup.string().required("Contract type is required"),
  }),
  cash: Yup.number().min(1,"Minimum 1").max(100, "Maximum 100"),
  validity: Yup.date().required("Validity date is required"),
});



export const getRefNoDdlForPurchaseContractPo = async (
  accId,
  buId,
  sbuId,
  orgId,
  plantId,
  whId,
  refTyp, 
  setter
  ) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrderReferenceNo/GetPurchaseContractReferenceNoDDL?accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}&purchaseOrgId=${orgId}&plantId=${plantId}&warehouseId=${whId}&refType=${refTyp}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
