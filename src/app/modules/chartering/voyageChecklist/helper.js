import axios from 'axios';
import { toast } from 'react-toastify';

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
