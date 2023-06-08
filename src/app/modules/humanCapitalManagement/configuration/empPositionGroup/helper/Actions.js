import axios from "axios";
import { toast } from "react-toastify";

export const getDDL = async (api, setter) => {
  let data = await axios.get(`${api}`);
  if (data) {
    setter(data.data);
  }
};

export const fetchLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  loader
) => {
  loader(true);
  try{
    let res = await axios.get(
      `/hcm/EmployeePositionGroup/EmployeePositionGroupLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
      setter(res?.data);
      loader(false);
    
  } catch(err){
    loader(false);
  }
};

export const fetchSingleData = async (id, setter) => {
  try {
    let res = await axios.get(
      `/hcm/EmployeePositionGroup/GetEmployeePositionGroupById?EmployeePositionGroupById=${id}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const editSingleData = async (editData, setDisabled) => {
  setDisabled(true);
  try {
    let data = await axios.put(
      `/hcm/EmployeePositionGroup/EditEmployeePositionGroup      `,
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
    .post(`/hcm/EmployeePositionGroup/CreateEmployeePositionGroup`, saveData)
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
