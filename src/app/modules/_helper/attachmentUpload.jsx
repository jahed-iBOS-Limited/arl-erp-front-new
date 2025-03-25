import axios from 'axios';
import { toast } from 'react-toastify';
export const attachmentUpload = async (attachment, setLoading) => {
  let formData = new FormData();
  Array.from(attachment)?.forEach((file) => {
    formData.append('files', file?.file ||file);
  });
  try {
    setLoading && setLoading(true);

    let { data } = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Upload  successfully');
    setLoading && setLoading(false);
    return data;
  } catch (error) {
    toast.error('Document not upload');
    setLoading && setLoading(false);
    return error;
  }
};


export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  Array.from(attachment)?.forEach((file) => {
    formData.append('files', file?.file);
  });
  try {
    let { data } = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success('Upload  successfully');
    return data;
  } catch (error) {
    toast.error('Document not upload');
  }
};

export const attachment_action = async (
  attachment,
  setFieldValue,
  setLoading
) => {
  setLoading(true);
  let formData = new FormData();
  Array.from(attachment)?.forEach((file) => {
    formData.append("files", file?.file);
  });
  setFieldValue("attachment", "");
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Upload  successfully");
    setFieldValue("attachmentRow", data?.[0]?.id);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error("Document not upload");
  }
};

export const uploadAttachment = (attachment) => {
  let formData = new FormData();
  Array.from(attachment)?.forEach((file) => {
    formData.append("files", file?.file);
  });
  return axios.post("/domain/Document/UploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
