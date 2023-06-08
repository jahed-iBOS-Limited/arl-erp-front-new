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
        code: itm.code,
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

export const createPersonalContactInfo_api = async (
  check,
  payload,
  cb,
  lainingApi,
  setDisabled
) => {
  const samePresentAddress = check ? 1 : 0;
  try {
    const res = await Axios.post(
      `/hcm/PersonalContactInfo/CreatePersonalContactInfo?Check=${samePresentAddress}`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      lainingApi();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getPersonalContactInfoById_api = async (employeeId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/PersonalContactInfo/GetPersonalContactInfoById?EmployeeId=${employeeId}`
    );

    if (res.status === 200 && res.data) {
      const data = res.data;

      
      const modifyGridData = {
        country: data?.present?.countryId
          ? {
              value: data?.present?.countryId,
              label: data?.present?.countryName,
            }
          : "",
        divison: data?.present?.divisionId
          ? {
              value: data?.present?.divisionId,
              label: data?.present?.divisionName,
            }
          : "",
        district: data?.present?.districtId
          ? {
              value: data?.present?.districtId,
              label: data?.present?.districtName,
            }
          : "",
        policeStation: data?.present?.thanaId
          ? {
              value: data?.present?.thanaId,
              label: data?.present?.thanaName,
            }
          : "",
        postCode: data?.present?.postCode
          ? { value: 1000, label: data?.present?.postCode }
          : "",
        village: data?.present?.villageStreet,
        samePresentAddress: data?.parmanent?.countryId ? false : true,
        country2: data?.parmanent?.countryId
          ? {
              value: data?.parmanent?.countryId,
              label: data?.parmanent?.countryName,
            }
          : "",
        divison2: data?.parmanent?.divisionId
          ? {
              value: data?.parmanent?.divisionId,
              label: data?.parmanent?.divisionName,
            }
          : "",
        district2: data?.parmanent?.districtId
          ? {
              value: data?.parmanent?.districtId,
              label: data?.parmanent?.districtName,
            }
          : "",
        policeStation2: data?.parmanent?.thanaId
          ? {
              value: data?.parmanent?.thanaId,
              label: data?.parmanent?.thanaName,
            }
          : "",
        postCode2: data?.parmanent?.postCode
          ? { value: 1000, label: data?.parmanent?.postCode }
          : "",
        village2: data?.parmanent?.villageStreet,
        presentId: data?.present?.contactId || 0,
        parmanentId: data?.parmanent?.contactId || 0,
      };
      if (data?.present?.countryId) {
        setter(modifyGridData);
      } else {
        setter("");
      }
    }
  } catch (error) {}
};

export const editPersonalContactInfo_api = async (
  check,
  payload,
  lainingApi,
  setDisabled
) => {
  const samePresentAddress = check ? 1 : 0;
  try {
    const res = await Axios.put(
      `/hcm/PersonalContactInfo/EditPersonalContactInfo?Check=${samePresentAddress}`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      lainingApi();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
