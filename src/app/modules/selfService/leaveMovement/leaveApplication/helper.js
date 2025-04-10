import Axios from 'axios';
import { toast } from 'react-toastify';

// Update Remove leave Move data
export const removeLeaveMoveAction = async (
  payload,
  updateRowDto,
  setRowDto
) => {
  try {
    const res = await Axios.put(
      `/hcm/LeaveAndMovement/RemoveLeaveOrMovement`,
      payload?.data
    );
    toast.success(res.data?.message || 'Leave/Movement remove successfully');
    setRowDto(updateRowDto);
    payload.cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
