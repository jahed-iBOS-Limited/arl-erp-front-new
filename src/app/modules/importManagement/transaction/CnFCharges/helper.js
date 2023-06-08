import axios from "axios";
import { toast } from "react-toastify";
export const getLandingData = async (
    accId,
    setDisabled,
    setter,
    pageNo,
    pageSize,
    search
  ) => {
    setDisabled(true);
    const searchPath = search ? `Search=${search}&` : "";
    try {
      let res = await axios.get(
        `/domain/CreateRoleManager/GetRoleManagerSearchLandingPasignation?${searchPath}AccountId=${accId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
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