import axios from 'axios';
import { toast } from 'react-toastify';

export const attachment_action = async (attachment, setLoading) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  formData.append('files', attachment[0]);
  try {
    let { data } = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setLoading && setLoading(false);
    toast.success('Upload  successfully');
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error('File Size is too large or inValid File!');
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

export const getVoyageByIdShow = async (voyageId, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/VoyageChecklist/GetVoyageById?VoyageId=${voyageId}`,
    );
    if (res?.data) {
      setter(res?.data);
    }
    setLoading && setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const createVoyageChecklist = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/hcm/VoyageChecklist/CreateVoyageCheckListRow`,
      payload,
    );
    cb && cb();
    toast.success(res?.data?.message || 'Created Successfully');
    setLoading && setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Something went wrong');
    setLoading && setLoading(false);
  }
};

//Landing
export const getVoyageChecklistPasignation = async (
  viewOrder,
  pageNo,
  pageSize,
  setter,
  setLoading,
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/VoyageChecklist/VoyageChecklistPasignation?viewOrder=${viewOrder}&pageNo=${pageNo}&pageSize=${pageSize}`,
    );
    if (res?.data) {
      setter(res?.data);
    }
    setLoading && setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
