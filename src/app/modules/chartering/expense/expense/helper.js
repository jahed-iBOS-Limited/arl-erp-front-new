import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../App";
import { isArray } from "lodash-es";
import { _todayDate } from "../../../_helper/_todayDate";
import { _dateFormatter } from "../../../_helper/_dateFormate";

// Validation schema
export const validationSchema = Yup.object().shape({
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel name is required"),
    value: Yup.string().required("Vessel name is required"),
  }),
  voyageNo: Yup.object().shape({
    label: Yup.string().required("Voyage No is required"),
    value: Yup.string().required("Voyage No is required"),
  }),
});

export const getAdditionalCostLandingData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  const vesselID = vesselId ? `&VesselId=${vesselId}` : "";
  const voyageID = voyageId ? `&VoyageId=${voyageId}` : "";
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/AdditionalCost/GetAddionalCostLanding?AccountId=${accId}&BusinessUnitId=${buId}${vesselID}${voyageID}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.data?.data?.length) {
      setter(res?.data);
    } else {
      setter([]);
      toast.warn("Data not found");
    }

    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const createAdditionalCost = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/AdditionalCost/CreateAdditionalCost`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const getCostTypeDDL = async (typeId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/PortPDA/GetAdditionalCost?VoyageTypeId=${typeId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const saveNewCostType = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/AdditionalCost/CreateAdditionalCostConfig`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const deleteAdditionalCost = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/AdditionalCost/InActiveAdditionalCost?AdditionalCostId=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const getAdditionalCostById = async (
  vesselId,
  voyageId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/AdditionalCost/GetAdditonalCostById?VesselId=${vesselId}&VoyageId=${voyageId}`
    );
    setter(res?.data);
    cb && cb(res?.data[0]);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const getBusinessPartnerDDL = async (
  buId,
  voyageId,
  stackHolderTypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Stakeholder/GetVoyageStackHolderInfo?BusinessUnitId=${buId}&VoyageId=${voyageId}&StackTypeId=${stackHolderTypeId}`
    );
    const modifyData = res?.data?.map((item) => {
      return {
        label: item.stackHolderName,
        value: item.stackHolderId,
      };
    });
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const editOrCashReceive = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/AdditionalCost/EditAdditionalCost`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const lastPriceFunc = (arr) => {
  if (!isArray(arr)) return 0;

  if (arr.length < 1) return 0;
  let newData = arr.map((item) => item?.lastPrice);
  let lastPrice = Math.min.apply(null, newData);
  if (lastPrice === Infinity) return 0;
  return (lastPrice || 0).toFixed(2);
};
export const initData = {
  isTransfer: true,
  purchaseOrg: { value: 11, label: "Local Procurement" },
  plant: "",
  warehouse: "",
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
  profitCenterTwo: "",
  freight: 0,
  discount: 0,
  commision: 0,
  othersCharge: 0,
  profitCenter: "",
};
//  Validation schema
export const validationSchemaForPo = Yup.object().shape({
  supplierName: Yup.object()
    .shape({
      label: Yup.string().required("Supplier name is required"),
      value: Yup.string().required("Supplier name is required"),
    })
    .nullable(),
  plant: Yup.object()
    .shape({
      label: Yup.string().required("Plant name is required"),
      value: Yup.string().required("Plant name is required"),
    })
    .required("Plant name is required"),
  warehouse: Yup.object()
    .shape({
      label: Yup.string().required("Warehouse name is required"),
      value: Yup.string().required("Warehouse name is required"),
    })
    .required("Warehouse name is required"),
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
