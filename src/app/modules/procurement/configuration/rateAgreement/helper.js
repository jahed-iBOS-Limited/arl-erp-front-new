import * as Yup from "yup";

export const rateAgreementValidationSchema = Yup.object().shape({
  nameOfContract: Yup.string().required("Name Of Contract is required"),
  contractStartDate: Yup.date().required("Contract Start Date is required"),
  contractEndDate: Yup.date().required("Contract End Date is required"),
  contractDate: Yup.date().required("Contract Date is required"),
  deliveryAdress: Yup.string().required("Contract Date is required"),
});

