import Axios from "axios";
import { toast } from "react-toastify";

export const getBonusNameDDL = (accId, buId, type, setter) => {
  Axios.get(
    `/hcm/BonusSetup/GetBonusNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&Type=${type}`
  ).then((res) => {
    setter(res?.data);
  });
};

export const getReligionDDL = (setter) => {
  Axios.get(`/hcm/HCMDDL/ReligionDDL`).then((res) => {
    const newResData = [{ value: 0, label: "All" }, ...res?.data];
    setter(newResData);
  });
};

export const getWorkplaceGroupDDL = (accId, setter) => {
  Axios.get(
    `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${accId}`
  ).then((res) => {
    setter(res?.data);
  });
};

export const bonusGenarateLandingAction = async (
  buId,
  bonusId,
  religionId,
  workPlaceGroupId,
  effectedDate,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/BonusGenerate/GetBonusGenerateForView?intBusinessUnitId=${buId}&religionId=${religionId}&workPlaceGroupId=${workPlaceGroupId}&bonusId=${bonusId}&effectedDate=${effectedDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};

export const createData = async (saveData, cb, setDisabled) => {
  setDisabled(true);
  await Axios.post(`/hcm/BonusGenerate/CreateBonusGenerate`, saveData)
    .then((res) => {
      let msg = res?.data?.message;

      let isPopUp = msg === "1" || msg === "2" || msg === "3" || msg === "4";

      let popMsg = "";

      if (msg === "1") {
        popMsg =
          "Already exist for this days, Are you sure to generate again?.";
      } else if (msg === "2") {
        popMsg =
          "Already exist for this month, Are you sure to generate again?.";
      } else if (msg === "3") {
        popMsg =
          "This bonus is already approved. Are you sure to generate again?.";
      } else if (msg === "4") {
        popMsg =
          "This bonus is already rejected. Are you sure to generate again?.";
      }

      if (isPopUp) {
        setDisabled(false);
        cb(popMsg);
      } else {
        setDisabled(false);
        toast.success(res?.data?.message);
      }
    })
    .catch((err) => {
      toast.warning(err?.response?.data?.message);
      setDisabled(false);
    });
};
