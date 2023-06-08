import * as Yup from "yup";

//validation schema;
export const validationSchema = Yup.object().shape({
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
    filter: Yup.string().required("Filter is required"),
    provider: Yup.string().required("Provider is required"),
    status: Yup.string().required("Status is required"),
  });