import axios from "axios";
import { toast } from "react-toastify";

export const uplaodAttachment = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file);
  });
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (data[0]?.id) {
      cb(data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Document not upload");
  }
};

export const updateProfilePicture = async (payload, setLoading, cb) => {
  try {
    let { data } = await axios.put(
      "/domain/CreateUser/UserImageUrlUpdate",
      payload
    );
    toast.success(data?.message || "Upload Successfully", { toastId: 123 });
    setLoading(false);
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      toastId: 1236,
    });
    setLoading(false);
  }
};

export function profileAPiCall(email) {
  return axios.get(
    `/domain/CreateUser/GetUserInformationByUserEmail?Email=${email}`
  );
}
