import * as Yup from "yup";

//validation schema;
export const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required("From Date is required"),
    toDate: Yup.date().required("To Date is required"),
    lcNumber: Yup.string().required("LC Number is required"),
    providor: Yup.string().required("Providor is required"),
  });