import axios from "axios";
import { toast } from "react-toastify";

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

export const getBusinessUnitDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetBusinessunitDDL");

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

export const getDepartmentDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetDepartmentDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getHRPositionDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetPositionDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getDesignationDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetDesignationDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmployeeGradeDDL = async (setter) => {
  try {
    const res = await axios.get("/hcm/HCMDDL/GetEmployeeGradeDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmpTypeDDL = async (accId, buId,setter) => {
  try {
    const res = await axios.get(`/hcm/HCMDDL/GetEmploymentTypeWithAccountBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${buId}`);

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
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

//create EmployeeBasicInformation
export const createEmpBasicInformation_api = async (data, cb, setDisabled) => {
  try {
    const res = await axios.post(
      `/rtm/SalesForceInformation/CreateSalesForceInfo`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
      setDisabled(false);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const employeeBasicInformation_landing_api = async (
  name,
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    // const res = await axios.get(
    //   `/hcm/EmployeeBasicInformation/EmployeeBasicInfoLandingPasignation?Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=1&PageSize=100`
    // );

    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/EmployeeBasicInfosearchLandingPasignation?Name=${name}&Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=1&PageSize=100`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const employeeBasicInformation_landing_top_api = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true);
  try {
    const searchPath = search ? `searcTerm=${search}&` : "";
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/EmployeeBasicInfoLandingPasignation?${searchPath}&Accountid=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
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

//sales force info

export const getLandingData = async (
  accId,
  buId,
  setDisabled,
  setter,
  pageNo,
  pageSize
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/rtm/SalesForceInformation/SalesForceInfoLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&vieworder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

// export const getEmpGroupDDL = async (accId,setter) => {
//   try {
//     const res = await axios.get(`/rtm/RTMDDL/GetGroupDDL?AccountId=${accId}`)

//     if (res.status === 200 && res.data) {
//       setter(res.data)
//     }
//   } catch (error) {}
// }

export const getEmpGroupDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/rtm/RTMDDL/RTMSalesForceLabelDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
