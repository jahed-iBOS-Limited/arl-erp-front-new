import Axios from 'axios';
import { toast } from 'react-toastify';

// Update Remove leave Move data
export const removeOfficialMovement_api = async (
  payload,
  updateRowDto,
  setRowDto
) => {
  try {
    const res = await Axios.put(
      `/hcm/OfficialMovement/RemoveOfficialMovement`,
      payload?.data
    );
    toast.success(res.data?.message || 'Leave/Movement remove successfully');
    setRowDto(updateRowDto);
    payload.cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
