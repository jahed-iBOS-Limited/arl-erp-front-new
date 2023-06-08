import Axios from "axios";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../../_helper/_todayDate";

export const initData = {
  isTransfer: false,
  transferBusinessUnit: "",
  leadTimeDays: "",
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
  validity: _todayDate(),
  otherTerms: "",
  referenceNo: "",
  item: "",
  controllingUnit: "",
  costCenter: "",
  costElement: "",
  costCenterTwo: "",
  costElementTwo: "",
  profitCenterTwo:"",
  freight: "",
  discount: "",
  commision: "",
  othersCharge: "",
  profitCenter: "",
};

//  Validation schema
export const validationSchema = Yup.object().shape({
  supplierName: Yup.object()
    .shape({
      label: Yup.string().required("Supplier name is required"),
      value: Yup.string().required("Supplier name is required"),
    })
    .nullable(),
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

  transferBusinessUnit: Yup.object().when("isTransfer", {
    is: true,
    then: Yup.object()
      .shape({
        value: Yup.string().required("Transfer Business unit is required"),
        label: Yup.string().required("Transfer Business unit is required"),
      })
      .typeError("Transfer Business unit is required"),
    otherwise: Yup.object(),
  }),
  costCenter: Yup.object().when("isTransfer", {
    is: true,
    then: Yup.object()
      .shape({
        value: Yup.string().required("Cost center is required"),
        label: Yup.string().required("Cost center  is required"),
      })
      .typeError("Cost center  is required"),
    otherwise: Yup.object(),
  }),
  costElement: Yup.object().when("isTransfer", {
    is: true,
    then: Yup.object()
      .shape({
        value: Yup.string().required("Cost element is required"),
        label: Yup.string().required("Cost element is required"),
      })
      .typeError("Cost element is required"),
    otherwise: Yup.object(),
  }),
  profitCenter: Yup.object().when("isTransfer", {
    is: true,
    then: Yup.object()
      .shape({
        value: Yup.string().required("Profit Center is required"),
        label: Yup.string().required("Profit Center is required"),
      })
      .typeError("Profit Center is required"),
    otherwise: Yup.object(),
  }),

  payDays: Yup.number()
    .required("Pay days is required")
    .min(1, "Minimum 1 days"),
  incoterms: Yup.object().shape({
    label: Yup.string().required("Incoterm is required"),
    value: Yup.string().required("Incoterm is required"),
  }),
  cash: Yup.number()
    .min(1, "Minimum 1")
    .max(100, "Maximum 100"),
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

export const getCostCenterDDL = async (accId, buId, isTransfer, setter) => {
  const url = isTransfer
    ? `/procurement/PurchaseOrder/CostCenter?AccountId=${accId}&UnitId=${buId}`
    : `/procurement/PurchaseOrder/GetCostCenter?AccountId=${accId}&UnitId=${buId}`;
  try {
    const res = await Axios.get(url);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// export const getCostElementDDL = async (accId, buId, isTransfer, setter) => {
//   const url = isTransfer
//     ? `/procurement/PurchaseOrder/CostElement?AccountId=${accId}&UnitId=${buId}`
//     : `/procurement/PurchaseOrder/GetCostElement?AccountId=${accId}&UnitId=${buId}`;
//   try {
//     const res = await Axios.get(url);
//     if (res.status === 200 && res?.data) {
//       setter(res?.data);
//     }
//   } catch (error) {}
// };


export const getCostElementDDL = async (unitId, accountId, costCenterId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};

export const getRefNoDdlForServicePo = async (
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
    const res = await Axios.get(
      `/procurement/PurchaseOrderReferenceNo/GetServicePOreferenceNoDDL?accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}&purchaseOrgId=${orgId}&plantId=${plantId}&warehouseId=${whId}&refType=${refTyp}`
    );
    console.log(res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
