import axios from "axios";
import { toast } from "react-toastify";

export const getDDL = async (api, setter) => {
  let data = await axios.get(`${api}`);
  if (data) {
    setter(data?.data);
  }
};

export const fetchLandingData = async (
  accId,
  buId,
  setter,
  setLoader,
  pageNo,
  pageSize
) => {
  setLoader(true);
  let res = await axios.get(
    `/hcm/EmploymentType/EmploymentTypeLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
  );
  if (res) {
    setter(res?.data);
    setLoader(false);
  }
};

export const fetchSingleData = async (id, locationState, setter) => {
  let data = await axios.get(
    `/hcm/EmploymentType/GetEmployementTypeById?EmployementTypeById=${id}`
  );
  if (data) {
    let DATA = {
      employmentType: data?.data[0].employmentType,
      businessUnit: locationState.businessUnit,
      isConsolidated: data?.data[0].isConsolidated,
    };
    setter(DATA);
  }
};

export const editSingleData = async (editData, setDisabled) => {
  setDisabled(true);
  try {
    let data = await axios.put(
      `/hcm/EmploymentType/EditEmploymentType`,
      editData
    );
    if (data.status === 200) {
      toast.success(data?.data?.message);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const createData = async (saveData, cb, setDisabled) => {
  setDisabled(true);
  await axios
    .post(`/hcm/EmploymentType/CreateEmploymentType`, saveData)
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
