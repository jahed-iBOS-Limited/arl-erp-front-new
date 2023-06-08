import Axios from "axios";
import { toast } from "react-toastify";

export const getHRPositionPagination = async (
  accountId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoader,
  search
) => {
  setLoader(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  try {
    const res = await Axios.get(
      `/hcm/EmpHRPosition/GetHRPositiontLandingSearchPasignation?${searchPath}AccountId=${accountId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      console.log(res.data);
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

export const saveHRPosition = async (data, cb, setDisabled) => {
  setDisabled(true);
  console.log("data", data);
  try {
    const res = await Axios.post(
      `/hcm/EmpHRPosition/CreateEmpHRPosition`,
      data
    );
    if (res.status === 200) {
      toast.success("Created successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const getPositionGroupDDL = async (setter) => {
  try {
    const res = await Axios.get(`/hcm/HCMDDL/GetEmployeePositionGroupDDL`);
    if (res.status === 200 && res?.data) {
      console.log("response", res.data);
      setter(res?.data);
    }
  } catch (error) {}
};

export const getHRPositionById = async (positionId, setter) => {
  console.log("from positionId", positionId);
  try {
    const res = await Axios.get(
      `/hcm/EmpHRPosition/GetHRPositionById?PositionId=${positionId}`
    );
    if (res.status === 200 && res?.data) {
      console.log("from positionData", res.data);
      setter(res.data);
    }
  } catch (error) {}
};
export const editHRPosition = async (data, cb, setDisabled) => {
  setDisabled(true);
  console.log("from editHrPage", data);
  try {
    const res = await Axios.put(`/hcm/EmpHRPosition/EditEmpHRPosition`, data);
    if (res.status === 200 && res?.data) {
      if (res.status === 200) {
        toast.success("Edited successfully");
        // cb();
        setDisabled(false);
      }
    }
  } catch (error) {
    setDisabled(false);
  }
};
