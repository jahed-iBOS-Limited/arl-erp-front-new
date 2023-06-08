import * as Yup from "yup";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Axios from "axios";
import { toast } from "react-toastify";

export const initData = {
  isTransfer: false,
  transferBusinessUnit: "",
  businessTransaction: "",
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
  deliveryDate: _todayDate(),
  isAllItem: false,
  freight: "",
  commision: "",
  discount: "",
  othersCharge: "",
  costCenter: "",
  costElement: "",
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
  payDays: Yup.number()
    .required("Pay days is required")
    .min(1, "Minimum 1 Days"),
  cash: Yup.number()
    .min(1, "Minimum 1")
    .max(100, "Maximum 100"),
  incoterms: Yup.object().shape({
    label: Yup.string().required("Incoterm is required"),
    value: Yup.string().required("Incoterm is required"),
  }),

  validity: Yup.date().required("Validity date is required"),
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
});

// all input fields : this function will set our all input fields  , then we will use loop to generate input fields in UI
export const setInputFieldsFunc = (setInputFields, storeData) => {
  const { currencyDDL, paymentTermsDDL, incoTermsDDL } = storeData;

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
      disabled: true,
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
      min: "1",
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
    // {
    //   label: "Other terms",
    //   name: "otherTerms",
    //   type: 2,
    // },
  ]);
};

export const getUOMList = async (itemId, buId, accId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetItemUomconversionData?ItemId=${itemId}&BusinessUnitId=${buId}&AccountId=${accId}`
    );
    const data = res?.data?.convertedList;
    const newData = data?.map((item) => {
      return {
        value: item?.value,
        label: item?.label,
      };
    });
    setter(newData);
  } catch (error) {}
};

export const getRefNoDdlForStandradPo = async (
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
      `/procurement/PurchaseOrderReferenceNo/GetStandardPOreferenceNoDDL?accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}&purchaseOrgId=${orgId}&plantId=${plantId}&warehouseId=${whId}&refType=${refTyp}`
    );
    console.log(res);
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
