import Axios from "axios";
import { toast } from "react-toastify";

export const attachmentUpload = async (attachment, cb) => {
    let formData = new FormData();
    attachment.forEach((file) => {
      formData.append("files", file);
    });
    try {
      let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // toast.success(res?.data?.message || "Submitted Successfully");
      toast.success("Upload  successfully");
      return data;
    } catch (error) {
      toast.error("Document not upload");
    }
  };