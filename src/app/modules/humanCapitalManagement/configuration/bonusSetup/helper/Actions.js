import axios from "axios";
import { toast } from "react-toastify";

export const getBonusNameDDL = (accId, buId, type, setter) => {
  axios
    .get(
      `/hcm/BonusSetup/GetBonusNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&Type=${type}`
    )
    .then((res) => {
      setter(res?.data);
    });
};

export const getReligionDDL = (setter) => {
  axios.get(`/hcm/HCMDDL/ReligionDDL`).then((res) => {
    const newResData = [{ value: 0, label: "All" }, ...res?.data];
    setter(newResData);
  });
};

export const getEmploymentTypeDDL = (accId, buId, setter) => {
  axios
    .get(
      `/hcm/HCMDDL/GetEmploymentTypeWithAccountBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    )
    .then((res) => {
      setter(res?.data);
    });
};

export const fetchLandingData = async (
  buId,
  pageNo,
  pageSize,
  setter,
  loader,
  search
) => {
  loader(true);
  const searchPath = search ? `&Search=${search}&` : "";
  let res = await axios.get(
    `/hcm/BonusSetup/GetBonusSetupLanding?BusinessUnitId=${buId}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
  if (res) {
    setter(res?.data);
    loader(false);
  }
};

export const fetchSingleData = async (id, setter) => {
  try {
    let res = await axios.get(
      `/hcm/BonusSetup/GetBonusSetupByID?BonusSetupId=${id}`
    );
    if (res?.status === 200) {
      // res?.data[0]
      const singleData = res?.data[0];
      const payload = {
        ...singleData,
        bonusName: {
          value: singleData?.bonusId,
          label: singleData?.bonusName,
          description: singleData?.bonusDescription,
        },
        bonusDescription: singleData?.bonusDescription,
        religion: {
          value: singleData?.religionId,
          label: singleData?.religion,
        },
        employeeType: {
          value: singleData?.employmentTypeId,
          label: singleData?.employmentType,
        },
        servicelength: singleData?.minimumServiceLengthMonth,
        bonusPercentageOn: {
          value: singleData?.bonusPercentageOn === "Gross" ? 1 : 2,
          label: singleData?.bonusPercentageOn,
        },
        bonusPercentage: singleData?.bonusPercentage,
      };

      setter(payload);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const createData = async (saveData, cb, setDisabled) => {
  setDisabled(true);
  await axios
    .post(`/hcm/BonusSetup/CreateBonusSetup`, saveData)
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

export const editSingleData = async (editData, setDisabled) => {
  setDisabled(true);
  try {
    let data = await axios.put(`/hcm/BonusSetup/EditBonusSetup`, editData);
    if (data.status === 200) {
      toast.success(data?.data?.message);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
