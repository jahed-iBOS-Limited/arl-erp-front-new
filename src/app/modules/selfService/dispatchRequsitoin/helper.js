import * as Yup from "yup";

export const dispatchRequisitionSchema = Yup.object().shape({
  receiverType: Yup.object().shape({
    label: Yup.string().required("Receiver Type is required"),
    value: Yup.string().required("Receiver Type is is required"),
  }),

  remarks: Yup.string().required("Remarks is required"),
  toLocation: Yup.string().required("To Location is required"),
  contactNo: Yup.string().required("contactNo is required"),
  dispatchDate: Yup.date().required("Dispatch Date is required"),
});
