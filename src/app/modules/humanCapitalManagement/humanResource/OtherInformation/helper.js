import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { toast } from "react-toastify";

export const GetEmployeeProfileSettingHeader_api = async (
  userId,
  buId,
  setter
) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeProfileSection/GetEmployeeProfileSettingHeader?employeeId=${userId}&intBusinessUnitId=${buId}`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

// dynamic section name
export const GetEmployeeProfileSetting_api = async (sectionName, setter) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeProfileSection/GetEmployeeProfileSetting?strSectionName=${sectionName}`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

// all get
export const employeeBasicInformation_Pagingation = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true);
  const searchPath = search ? `${search}&` : "";

  try {
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/EmployeeBasicInfoLandingPasignation?searcTerm=${searchPath}&Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    )

    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

// create
export const createEmployeeSettings = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/hcm/EmployeeSettings/CreateEmployeeSettings`,
      payload
    );
    if (res.status === 200 && res.data) {
      cb();
      toast.success(res?.data?.message || "Created Successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setDisabled(false);
  }
};

// dynamic section name
export const GetEmployeeProfileSettingById_api = async (
  accId,
  busId,
  userId,
  sectionId,
  setter
) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeSettings/GetAllEmployeeSettings?accId=${accId}&BusinessId=${busId}&employeeId=${userId}&sectionId=${sectionId}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

