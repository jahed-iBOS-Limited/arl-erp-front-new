// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (
  accId,
  buId,
  setDisabled,
  setter,
  pageNo,
  pageSize
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/rtm/Beat/GetBeatLandingPasignation?accountId=${accId}&businessUnitid=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};