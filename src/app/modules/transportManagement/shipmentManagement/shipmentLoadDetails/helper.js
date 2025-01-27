import * as Yup from "yup";

/* ====== landing page ======= */
export const landingInitData = {};

/* ====== common create , edit page ======= */
export const shiftDDL = [
  { value: 1, label: "Shift A" },
  { value: 2, label: "Shift B" },
  { value: 3, label: "Shift C" },
  { value: 4, label: "Shift D" },
];

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

export function fetchShipPointDDL(obj) {}

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
        const { shipment } = this.parent;
        if (quantity <= shipment?.totalRemainingQuantity) {
          return true;
        } else {
          return false;
        }
      }
    ),
});
