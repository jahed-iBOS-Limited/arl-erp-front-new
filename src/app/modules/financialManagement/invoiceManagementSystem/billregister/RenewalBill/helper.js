import Axios from "axios";
// import { toast } from "react-toastify";

export const getSingleDataById = async (id, setter) => {
  try {
    const res = await Axios.get(`/asset/DetalisView/GetRenewalInfo?RenewalId=${id}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};
