import Axios from "axios";
import { toast } from "react-toastify";

export const getDamageCalender = async (
  accId,
  buId,
  yearId,
  setter,
  setDisabled
) => {
  setDisabled && setDisabled(true);

  try {
    let res = await Axios.get(
      `/rtm/DamageConfiguration/GetDamageCalender?AccountId=${accId}&BusinessUnitId=${buId}&YearId=${yearId}`
    );
    if (res?.status === 200) {
      if (res?.data?.length > 0) {
        setter(res?.data);
        setDisabled && setDisabled(false);
      } else {
        setter([]);
        setDisabled && setDisabled(false);
      }
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled && setDisabled(false);
  }
};
export const damageCalenderSave = async (data, setDisabled, cb) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/rtm/DamageConfiguration/DamageCalenderSave`,
      data
    );
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
