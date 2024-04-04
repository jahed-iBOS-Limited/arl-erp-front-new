import * as Yup from "yup";

export const dispatchReceiveValidationSchema = Yup.object().shape({
    receiveType: Yup.object().shape({
    label: Yup.string().required("Receive Type is required"),
    value: Yup.string().required("Receive Type is is required"),
  }),
  receiverName: Yup.object().shape({
    label: Yup.string().required("Receiver Name is required"),
    value: Yup.string().required("Receiver Name is is required"),
  }),

  remarks: Yup.string().required("Remarks is required"),
  fromLocation: Yup.string().required("From Location is required"),
  receiverContractNo: Yup.string().required("ReceiverContract is required"),
  receiveDate: Yup.date().required("ReceiveDate Date is required"),
});
