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
  fromLocationDDL:Yup.object().when('receiveType',{
    is:(receiveType) => receiveType && receiveType.value === 2,
    then: Yup.object().required("From Location is required"),
    otherwise: Yup.object()
  }),
  fromLocation: Yup.string().when('receiveType',{
    is:(receiveType) => receiveType && receiveType.value === 1,
    then: Yup.string().required("From Location is required"),
    otherwise: Yup.string()
  }),
  senderName: Yup.string().required("Sender Name is required"),
  // receiverContractNo: Yup.string().required("ReceiverContract is required"),
  receiveDate: Yup.date().required("Receive Date is required"),
});
