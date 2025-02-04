import * as Yup from "yup";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";

/* ====== landing page ======= */
export const landingInitData = {
  reportType: "",
  shippoint: "",
  shipment: "",
  fromDate: _monthFirstDate(),
  toDate: _monthLastDate(),
};

// report type ddl
export const reportTypeDDL = [
  { value: 1, label: "Details" },
  { value: 2, label: "Top Sheet" },
];

// landing validation
export const landingValidation = Yup.object().shape({
  reportType: Yup.object({
    value: Yup.number().required("Report type is required"),
    label: Yup.string().required("Report type is required"),
  }).required("Report type is required"),
  shippoint: Yup.object({
    value: Yup.number().required("Shippoint is required"),
    label: Yup.string().required("Shippoint is required"),
  }).required("Shippoint is required"),
  shipment: Yup.object().when("reportType", (reportType, schema) => {
    if (reportType?.label === "Details") {
      return schema.required("Shipment is required");
    }
    return schema.notRequired();
  }),
  fromDate: Yup.date().when("reportType", (reportType, schema) => {
    if (reportType?.label === "Details") {
      return schema.notRequired();
    }
    return schema.required("From date is required");
  }),
  toDate: Yup.date().when("reportType", (reportType, schema) => {
    if (reportType?.label === "Details") {
      return schema.notRequired();
    }
    return schema.required("To date is required");
  }),
});

// landing details fetch
export function fetchShipmentDetailsData(obj) {
  // destrcuture
  const {
    getShipmentLoadDetails,
    getShipmentLoadTopSheet,
    values,
    selectedBusinessUnit,
    cb,
  } = obj;
  const { shipment, reportType, shippoint, fromDate, toDate } = values;

  switch (reportType?.label) {
    case "Details":
      return getShipmentLoadDetails(
        `/oms/ShipmentTransfer/GetShipmentLoading?businessUnitId=${selectedBusinessUnit?.value}&shipPointId=${shippoint?.value}&shipmentId=${shipment?.value}`,
        cb
      );
    case "Top Sheet":
      return getShipmentLoadTopSheet(
        `/oms/ShipmentTransfer/GetShipmentLoadingTopSheet?businessUnitId=${selectedBusinessUnit?.value}&shipPointId=${shippoint?.value}&fromDate=${fromDate}&toDate=${toDate}`,
        cb
      );

    default:
      return false;
  }
}

/* ====== common create , edit page ======= */
export const shiftDDL = [
  { value: 1, label: "Shift A" },
  { value: 2, label: "Shift B" },
  { value: 3, label: "Shift C" },
  { value: 4, label: "Shift D" },
];

// is editing mode
export function isEditingMode(params) {
  if (params?.id && params?.type === "edit") {
    return true;
  }
  return false;
}

// empty state
export function notEmptyState(location) {
  if (
    Object.keys(location?.state).length > 0 &&
    location?.state.constructor === Object
  ) {
    return true;
  }
  return false;
}

// get shift value with shift name
function getShiftValue(shiftName) {
  const regex = new RegExp(/^Shift [ABCD]$/i);

  if (regex.test(shiftName)) {
    return shiftDDL.find((item) => item?.label === shiftName);
  }
  return "";
}

// set formik init data when mode is editing
export function generateEditInitData(location) {
  const {
    state: {
      shiftName,
      shipPointName,
      shipPointId,
      shipmentCode,
      shipmentId,
      quantity,
      totalNetWeight,
      totalLoadQuantity,
      totalRemainingQuantity,
      loadingDate,
    },
  } = location;

  return {
    shift: getShiftValue(shiftName),
    shippoint: {
      label: shipPointName,
      value: shipPointId,
    },
    shipment: {
      value: shipmentId,
      label: shipmentCode,
      totalNetWeight: totalNetWeight || 50,
      totalLoadQuantity: totalLoadQuantity || 20,
      totalRemainingQuantity: totalRemainingQuantity || 30,
    },
    quantity: quantity,
    loadingDate: loadingDate,
    existingQuantity: quantity, // set current quantity in hidden state named existing Quantity because we need to do validation of current quantity & remaining quantity when editing
    isEditing: true, // enable edit true by default when set state for edit (this doesn't called in inital)
  };
}

// auth url for common ddl function
const apiURLObj = {
  shipPoint: `/wms/ShipPoint/GetShipPointDDL`,
  shipmentLoading: `/oms/ShipmentTransfer/GetShipmentToLoadDDL`,
};

// generate params for common ddl function
function generateParams(apiName, obj) {
  const { values, selectedBusinessUnit, profileData } = obj;
  switch (apiName) {
    case "shipPoint":
      return `accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`;
    case "shipmentLoading":
      return `businessUnitId=${selectedBusinessUnit?.value}&shipPointId=${values?.shippoint?.value}`;
    default:
      return "";
  }
}

// fetch ddl with common function
export function fetchCommonDDL(obj) {
  // destrcuture
  const {
    getApi,
    apiName,
    values,
    selectedBusinessUnit,
    profileData,
    cb,
  } = obj;

  // generate params
  const params = generateParams(apiName, {
    values,
    selectedBusinessUnit,
    profileData,
  });

  // get data
  getApi(`${apiURLObj[apiName]}?${params}`, cb);
}

/* ====== create page ======= */
export const createInitData = {
  shippoint: "",
  shipment: "",
  shift: "",
  quantity: "",
  loadingDate: "",
};

/* ====== edit page ======= */
export const validationSchema = Yup.object().shape({
  shippoint: Yup.object({
    value: Yup.number().required("Shippoint is required"),
    label: Yup.string().required("Shippoint is required"),
  }).required("Shippoint is required"),
  shipment: Yup.object({
    value: Yup.number().required("Shipment is required"),
    label: Yup.string().required("Shipment is required"),
  }).required("Shipment is required"),
  shift: Yup.object({
    value: Yup.number().required("Shift is required"),
    label: Yup.string().required("Shift is required"),
  }).required("Shift is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .test(
      "Current qty should be less than remaining qty",
      "Current quantity can't be more than remaining quantity",
      function(quantity) {
        const { shipment, isEditing, existingQuantity } = this.parent;
        if (Boolean(isEditing)) {
          if (quantity <= existingQuantity + shipment?.totalRemainingQuantity) {
            return true;
          } else return false;
        } else {
          if (quantity <= shipment?.totalRemainingQuantity) {
            return true;
          } else {
            return false;
          }
        }
      }
    ),

  loadingDate: Yup.date().required("Loading date is required"),
});
