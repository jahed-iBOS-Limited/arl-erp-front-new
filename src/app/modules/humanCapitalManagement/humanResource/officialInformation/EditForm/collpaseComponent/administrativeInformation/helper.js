import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../../../../_helper/_dateFormate";

export const getHRGroupDDL = async () => {}; //DON'T HAVE API

export const getPayrollGroupDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetPayrollGroupDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const getEmployeeUnionDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeUnionDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const getOrganizationStructureDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetOrganizationStructureDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const getOrganizationComponentDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetOrganizationComponentDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const getRemunerationTypeDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetRemunerationTypeDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};
export const getCalenderDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetCalenderDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};
export const getCalenderRoasterDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetCalenderRosterDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const getEmpRemunerationIdDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeRemunerationIdDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};
//administrativeId_api
export const administrativeId_api = async (id, setter) => {
  try {
    const res = await axios.get(
      `/hcm/AdministrativeInformation/GetAdministrativeInfoById?AdministrativeId=${id}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

export const runningCalender_api = async (roasterHeaderId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMRosterReport/GetRosterGroupByCalenderIdDDL?RoasterGrpHeaderId=${roasterHeaderId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

//CREATE ADMINISTRATIVE INFORMATION
export const createAdministrativeInformation_api = async (
  payload,
  cb,
  setDisabled
) => {
  try {
    const res = await axios.post(
      "/hcm/AdministrativeInformation/CreateAdministrativeInformation",
      payload
    );

    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setDisabled(false);
  }
};

export const getAdministrativeInfoById_api = async (employeeId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/AdministrativeInformation/GetAdministrativeInfoByIdForEdit?EmployeeId=${employeeId}`
    );
    if (res.status === 200 && res.data) {
      const data = res.data[0];
      const modifyGridData = {
        administrativeId: data?.administrativeId,
        payrollGroup: data?.payrollGroupId ? {
          value: data?.payrollGroupId,
          label: data?.payrollGroupName,
        } : "",
        employeeUnion: data?.employeeUnionId ? {
          value: data?.employeeUnionId,
          label: data?.employeeUnionName,
        } : "",
        organizationStructure: data?.orgStructureId ? {
          value: data?.orgStructureId,
          label: data?.orgStructureName,
        } : "",
        organizationComponent: data?.orgComponentId ? {
          value: data?.orgComponentId,
          label: data?.orgComponentName,
        } : "",
        remunerationType: data?.remunerationTypeId ? {
          value: data?.remunerationTypeId,
          label: data?.remunerationTypeName,
        } : "",
        employeeRemunerationId: "",
        cardNo: data?.cardNo,
        comments: data?.comments,
        dateOfJoining: _dateFormatter(data?.joiningDate),
        joiningLetter: data?.joiningLetterLink,
        employeeGroup: data?.intEmployeeGroupId ? {
          value: data?.intEmployeeGroupId,
          label: data?.strEmployeeGroup,
        } : "",
      };
      if (res.data.length > 0) {
        setter(modifyGridData);
      } else {
        setter("");
      }
    }
  } catch (error) {}
};

export const editAdministrativeInformation_api = async (
  payload,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      "/hcm/AdministrativeInformation/EditAdministrativeInformation",
      payload
    );

    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setDisabled(false);
  }
};
// emp group ddl
export const getEployeeGroupDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetEmployeeGroupDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
