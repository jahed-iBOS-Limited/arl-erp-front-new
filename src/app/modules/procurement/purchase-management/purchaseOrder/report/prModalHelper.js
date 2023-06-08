import axios from "axios";
import { toast } from "react-toastify";

export const sendEmailPostApi = async (dataObj, cb) => {
  let formData = new FormData();
  // formData.append("to", dataObj?.toMail);
  // formData.append("cc", dataObj?.toCC);
  // formData.append("bcc", dataObj?.toBCC);
  // formData.append("subject", dataObj?.subject);
  // formData.append("body", dataObj?.message);
  // formData.append("file", dataObj?.attachment);
  if (!dataObj?.toMail) {
    return toast.warning("To Mail Address is required");
  } else if (!dataObj?.attachment) {
    return toast.warning("Attachment is required");
  }

  if (dataObj.toCC && dataObj.toBCC) {
    formData.append("to", dataObj?.toMail);
    formData.append("cc", dataObj?.toCC);
    formData.append("bcc", dataObj?.toBCC);
    formData.append("subject", dataObj?.subject);
    formData.append("body", dataObj?.message);
    formData.append("file", dataObj?.attachment);
  } else if (dataObj.toBCC) {
    formData.append("to", dataObj?.toMail);
    formData.append("bcc", dataObj?.toBCC);
    formData.append("subject", dataObj?.subject);
    formData.append("body", dataObj?.message);
    formData.append("file", dataObj?.attachment);
  } else if (dataObj.toCC) {
    formData.append("to", dataObj?.toMail);
    formData.append("cc", dataObj?.toCC);
    formData.append("subject", dataObj?.subject);
    formData.append("body", dataObj?.message);
    formData.append("file", dataObj?.attachment);
  } else {
    formData.append("to", dataObj?.toMail);
    formData.append("subject", dataObj?.subject);
    formData.append("body", dataObj?.message);
    formData.append("file", dataObj?.attachment);
  }

  try {
    let { data } = await axios.post("/domain/MailSender/SendMail", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    cb();

    toast.success("Mail Send Successfully");
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Mail cant not send successfully"
    );
  }
};

export const getReportListPurchaseReq = async (prId, buId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseRequest/GetPurchaseRequestInformationByRequestIdPrint?RequestId=${prId}&BusinessUnitId=${buId}`
    );
    setter(res?.data[0]);
  } catch (error) {}
};
