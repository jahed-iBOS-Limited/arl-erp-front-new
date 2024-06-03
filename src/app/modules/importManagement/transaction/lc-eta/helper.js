import * as Yup from "yup";


export const validationSchema = Yup.object().shape({
 poNo: Yup.object().shape({
    label: Yup.string().required("PO No is required"),
    value: Yup.string().required("PO No is required"),
  }),
  etaDate: Yup.string().required("ETA Date is required"),
  invoiceNo: Yup.string().required("Invoice No is required"),
  blNo: Yup.string().required("BL No is required"),
  vesselName: Yup.string().required("Vessel Name is required"),
  numberOfContainer: Yup.string().required("Number of Container is required")
});
