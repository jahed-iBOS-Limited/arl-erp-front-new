import Axios from "axios";
import { toast } from "react-toastify";

export const getFamilyInfo = async (setter) => {
  try {
    const res = await Axios.get(
      `/hcm/FamilyInfo/FamilyInfoLandingPasignation?EmployeeId=1&viewOrder=desc&PageNo=1&PageSize=1`
    );
    if (res.status === 200) {
      setter(res.data.data);
    }
  } catch (error) {
    console.log(error?.response);
  }
};
//religionDDL_api
export const religionDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/ReligionDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
//getGenderDDL
export const getGenderDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetGenderDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmpIdentificationTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetEmployeeIdentificationTypeDDL");
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const createFamilyInfo_api = async (payload, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post("/hcm/FamilyInfo/CreateFamilyInfo", payload);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

//getFamilyInfoById_api
export const getFamilyInfoById_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/FamilyInfo/GetFamilyInfoById?FamilyInfoId=${id}`
    );
    if (res.status === 200 && res.data) {
      console.log(res?.data, "jjjjj");
      const data = res.data;
      if (res.data.length > 0) {
        setter(data);
      } else {
        setter([]);
      }
    }
  } catch (error) {}
};

export const editFamilyInfo_api = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put("/hcm/FamilyInfo/EditFamilyInfo", payload);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
