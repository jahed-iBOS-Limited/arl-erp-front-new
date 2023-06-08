import axios from "axios";
import { toast } from "react-toastify";

export const createBonus = async (payload, cb, setDisabled) => {
  setDisabled(true);
  await axios
    .post(`/hcm/Bonus/CreateBonus`, payload)
    .then((data) => {
      if (data.status === 200) {
        toast.success(data.data.message);
        cb();
        setDisabled(false);
      }
    })
    .catch((err) => {
      toast.warning(err?.response?.data?.message);
      setDisabled(false);
    });
};

export const fetchLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  loader,
  search
) => {
  loader(true);
  const searchPath = search ? `Search=${search}&` : "";
  let res = await axios.get(
    `/hcm/Bonus/GetBonusLanding?AccountId=${accId}&BusinessUnitId=${buId}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
  if (res) {
    setter(res?.data);
    loader(false);
  }
};

export const fetchSingleData = async (id, setter) => {
  try {
    let res = await axios.get(`/hcm/Bonus/GetBonusNameByID?BonusId=${id}`);
    if (res?.status === 200) {
      setter(res?.data[0]);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const editSingleData = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    let data = await axios.put(`/hcm/Bonus/EditBonus`, payload);
    if (data.status === 200) {
      toast.success(data?.data?.message);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
