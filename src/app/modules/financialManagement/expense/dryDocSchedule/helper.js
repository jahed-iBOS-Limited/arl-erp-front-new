import axios from "axios";
import { toast } from "react-toastify";

export const attachmentUploadAction = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};
