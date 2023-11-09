import * as Yup from "yup";
export const employeeIncentiveValidationSchema = Yup.object().shape({
    salesOrganization: Yup.object()
      .shape({
        label: Yup.string().required("Sales Organization is required"),
        value: Yup.string().required("Sales Organization is required"),
      })
      .typeError("Sales Organization is required"),
      distributionChannel: Yup.object()
      .shape({
        label: Yup.string().required("Distribution Channel is required"),
        value: Yup.string().required("Distribution Channel is required"),
      })
      .typeError("Distribution Channel is required"),
      incentiveOn: Yup.object()
      .shape({
        label: Yup.string().required("Incentive On is required"),
        value: Yup.string().required("Incentive On is required"),
      })
      .typeError("Incentive On is required"),
      calculation: Yup.object()
      .shape({
        label: Yup.string().required("Calculate by is required"),
        value: Yup.string().required("Calculate by is required"),
      })
      .typeError("Calculate by is required"),
      effectiveFromDate: Yup.date().required("Effective From Date is required"),
      effectiveToDate: Yup.date().required("Effective To Date is required"),
  });