import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  shippingPoint: Yup.object().shape({
    value: Yup.string().required("Ship Point is required"),
    label: Yup.string().required("Ship Point is required"),
  }),
  route: Yup.object().shape({
    value: Yup.string().required("Route is required"),
    label: Yup.string().required("Route is required"),
  }),
  wareHouse: Yup.object().shape({
    value: Yup.string().required("Warehouse is required"),
    label: Yup.string().required("Warehouse is required"),
  }),
  transportZone: Yup.object().shape({
    value: Yup.string().required("Transport zone is required"),
    label: Yup.string().required("Transport zone is required"),
  }),
});
