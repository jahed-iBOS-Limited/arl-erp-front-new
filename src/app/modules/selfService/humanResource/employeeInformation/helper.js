import axios from "axios";
import { toast } from "react-toastify";

export const getWorkplaceGroupDDLAction = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getCostCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );

    if (res.status === 200 && res.data) {
      const data = res?.data.map((itm) => ({
        value: itm?.value,
        label: `${itm?.label} (${itm?.code})`,
      }));
      setter(data);
    }
  } catch (error) {}
};

export const getAllTableData = async (empId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/Report/GetEmployeeinformationReport?EmployeeId=${empId}`
    );

    if (res?.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {}
};

export const getBusinessUnitDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetSBUDDL?AccountId=${accId}&BusineessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getWorkplaceDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res.data) {
      const modfid = res?.data?.map((item) => ({
        value: item?.workplaceId,
        label: item?.workplaceName,
        code: item?.workplaceCode,
        workplaceGroupId: item?.workplaceGroupId,
      }));
      setter(modfid);
    }
  } catch (error) {}
};

export const getDepartmentDDL = async (
  accountId,
  buId,
  setter,
  isAddAllField = false
) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetDepartmentWithAcIdBuIdDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    );
    let data = res?.data;
    isAddAllField && data.unshift({ value: 0, label: "All" });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getHRPositionDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetPositionFromDesignationTbl?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getDesignationDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetDesignationWithBusinessUnitDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const getEmployeeGradeDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeGradeDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmpTypeDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetEmploymentTypeWithAccountBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getEmpStatusDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeStatusDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const getLineManagerDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetLineManagerDDL?AccountId=${accId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getLineManagersDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetLineManagerWithACCandBusDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

//create EmployeeBasicInformation
export const createEmpBasicInformation_api = async (
  data,
  cb,
  setDisabled,
  setModalMessage
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/hcm/EmployeeBasicInformation/CreateEmployeeBasicInformationIBOS`,
      data
    );
    if (res.status === 200) {
      console.log(res?.data?.message);
      setModalMessage(res?.data);
      setDisabled(false);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const employeeBasicInformation_landing_api_new = async (
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
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const employeeBasicInformation_landing_api_Fof_Filtering = async (
  accId,
  buId,
  setter,
  setLoading,
  empStatusId,
  workPlaceGrpId,
  searchValue,
  pageNo,
  pageSize
) => {
  setLoading(true);
  const searchPath = searchValue ? `${searchValue}` : "";
  try {
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/EmployeeBasicInfoLandingPasignationWithFiltering?SearchText=${searchPath}&EmpStatusId=${empStatusId}&WorkplaceGroupId=${workPlaceGrpId}&Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );

    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const getempInfoGridforOwnView = async (setter, setLoading, empId) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/EmployeeBasicInfoOwnLanding?employeeId=${empId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter("");
    setLoading(false);
  }
};

export const employeeBasicInformation_landing_top_api = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/EmployeeBasicInfoLandingPasignation?Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

export const getImageFile_api = async (id) => {
  try {
    const res = await axios.get(`/sme/Document/DownlloadFile?id=${id}`);

    if (res.status === 200 && res.data) {
      return res?.config?.url;
    }
  } catch (error) {}
};

export const religionDDL_api = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/ReligionDDL");
    setter(res.data);
  } catch (error) {}
};

export const getBankDDL_api = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetBankDDL");
    setter(res.data);
  } catch (error) {}
};
export const getBankBranchDDL_api = async (bankId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetBankBranchDDL?BankId=${bankId}`
    );
    setter(res.data);
  } catch (error) {}
};

export const getAllDistrictAction = async (setter) => {
  try {
    const res = await axios.get(`/hcm/HCMDDL/GetBDAllDistrictDDL`);
    setter(res.data);
  } catch (error) {}
};
