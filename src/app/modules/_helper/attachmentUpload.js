import axios from 'axios';
import { toast } from 'react-toastify';
export const attachmentUpload = async (attachment, setLoading) => {
  console.log(attachment, 'fileObjects');
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append('files', file);
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
  attachment.forEach((file) => {
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