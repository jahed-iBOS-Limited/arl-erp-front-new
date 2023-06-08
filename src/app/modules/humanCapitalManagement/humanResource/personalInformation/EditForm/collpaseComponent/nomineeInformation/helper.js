import Axios from "axios";
import { toast } from "react-toastify";
//getCountryDDL_api
export const getCountryDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetCountryDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
//getDivisionDDL_api
export const getDivisionDDL_api = async (countryId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDivisionDDL?countryId=${countryId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const getDistrictDDL_api = async (countryId, divisionId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDistrictDDL?countryId=${countryId}&divisionId=${divisionId}`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getPoliceStationDDL_api = async (
  countryId,
  divisionId,
  districtId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/oms/TerritoryInfo/GetThanaDDL?countryId=${countryId}&divisionId=${divisionId}&districtId=${districtId}`
    );

    if (res.status === 200 && res.data) {
      const data = res.data.map((itm) => ({
        value: itm.value,
        label: `${itm?.label} PC: [${itm?.code}]`,
        code: itm?.code,
      }));
      setter(data);
    }
  } catch (error) {}
};

export const getPostCodeDDL_api = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetPostCodeDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const createEmployeeNomineeInfo_api = async (
  payload,
  cb,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      "/hcm/EmployeeNomineeInfo/CreateEmployeeNomineeInfo",
      payload
    );
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

export const getNationalityDDL = async (setter) => {
  try {
    const res = await Axios.get("/hcm/HCMDDL/GetNationalityDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

//GetEmployeeNomineeById
export const getEmployeeNomineeById_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/EmployeeNomineeInfo/GetEmployeeNomineeById?EmployeeId=${id}`
    );
    if (res.status === 200 && res.data) {
      const data = res.data;
      if (res.data.length > 0) {
        setter(data);
      } else {
        setter([]);
      }
    }
  } catch (error) {}
};

export const editEmployeeNomineeInfo_api = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      "/hcm/EmployeeNomineeInfo/EditEmployeeNomineeInfo",
      payload
    );
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
