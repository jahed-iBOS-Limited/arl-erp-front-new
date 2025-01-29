import * as Yup from "yup";

/* ====== landing page ======= */
export const landingInitData = {
  shippoint: "",
  shipment: "",
};

// landing validation
export const landingValidation = Yup.object().shape({
  shippoint: Yup.object({
    value: Yup.number().required("Shippoint is required"),
    label: Yup.string().required("Shippoint is required"),
  }).required("Shippoint is required"),
  shipment: Yup.object({
    value: Yup.number().required("Shipment is required"),
    label: Yup.string().required("Shipment is required"),
  }).required("Shipment is required"),
});

// landing details fetch
export function fetchShipmentDetailsData(obj) {
  // destrcuture
  const { getShipmentLoadDetails, values, selectedBusinessUnit, cb } = obj;
  const { shipment } = values;

  getShipmentLoadDetails(
    `/oms/ShipmentTransfer/GetShipmentLoading?businessUnitId=${selectedBusinessUnit?.value}&shipmentId=${shipment?.value}`,
    cb
  );
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
});
