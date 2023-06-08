import Axios from "axios";
import { toast } from "react-toastify";



export const getEmpInfoById = async (valueOption, setFieldValue, fieldName) => {
  try {
    let res = await Axios.get(`/hcm/HCMDDL/GetEmployeeDetailsByEmpId?EmpId=${valueOption?.value}`);
    let { employeeInfoDesignation, employeeBusinessUnit, employeeInfoDepartment} = res?.data
    setFieldValue(
      "employeeInfo",
      `${employeeInfoDesignation},${employeeInfoDepartment},${employeeBusinessUnit}`
    );
    setFieldValue(fieldName, {...valueOption, ...res?.data})
  } catch (error) {
    return null;
  }
};

export const getCountryDDL = async (setter) => {
  try {
    const res = await Axios.get(`/hcm/HCMDDL/GetCountryDDL`);
    const data = res?.data;
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getDistrictDDLAction = async (countryId, divisionId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetBDAllDistrictDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const leaveAppLandingPagintaion_api = async (
  empId,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/LeaveApplication/LeaveApplicationLandingPagintaion?EmployeeId=${empId}&PageNo=1&PageSize=1000&viewOrder=desc`
    );
    const data = res?.data;
    console.log(res?.data, "res?.data");
    setter(data?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    setLoader(false);
  }
};

export const changeReqSaveAction = async (payload, setLoader, changeReqDateCb, PrevValues, setIsShowModal) => {
  setLoader(true);
  try {
    const res = await Axios.post(
      `/hcm/HCMLeaveApplication/PLChangeRequest`,
      payload
    );
    // callback for leave application, it will be called from modal, when user save req date
    changeReqDateCb(PrevValues)
    setIsShowModal(false)
    toast.success(res.data?.message || "Updated successfully");
    setLoader(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Please try again");
    setLoader(false);
  }
};

export const OfficialMoveLandingPagination_api = async (
  empId,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/OfficialMovement/OfficialMovementLandingPagination?EmployeeId=${empId}&PageNo=1&PageSize=100&viewOrder=desc`
    );
    const data = res?.data;
    setter(data?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
    setLoader(false);
  }
};

export const getEmployeeDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    const data = res?.data.map((itm) => {
      return {
        ...itm,
        value: itm?.value,
        label: itm?.label,
      };
    });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getLeaveTypeDDL = async (checkId, empId, setter) => {
  try {
    // const res = await Axios.get(
    //   `/hcm/HCMDDL/GetLeaveTypeDDL?check=${checkId}&accountId=${accId}`
    // );
    const res = await Axios.get(
      `/hcm/HCMDDL/GetEmpWiseLeaveTypeDDL?check=${checkId}&employeeId=${empId}`
    );
    const data = res?.data;
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const saveLeaveMovementAction = async (data, cb, setDisabled) => {
  let {
    typeId,
    employeeId,
    accountId,
    businessUnitId,
    applicationDate,
    appliedFromDate,
    appliedToDate,
    documentFile,
    reason,
    addressDueToLeaveMove,
    actionBy,
    tmStart,
    tmEnd,
  } = data;
  try {
    if ((typeId === 10 || typeId === 8) && (!tmStart || !tmEnd))
      return toast.warn("Time is required");
    setDisabled(true);

    let fromModifiedTime = tmStart || null;
    let toModifiedTime = tmEnd || null;

    let url = `/hcm/HCMLeaveApplication/LeaveApplication?leaveTypeId=${typeId}&employeeId=${employeeId}&accountId=${accountId}&businessUnitId=${businessUnitId}&applicationDate=${applicationDate}&appliedFromDate=${appliedFromDate}&appliedToDate=${appliedToDate}&leaveReason=${reason}&addressDuetoLeave=${addressDueToLeaveMove}&ActionBy=${actionBy}&documentFile=${
      documentFile ? documentFile : ""
    }`;

    if (fromModifiedTime && toModifiedTime) {
      url = `/hcm/HCMLeaveApplication/LeaveApplication?leaveTypeId=${typeId}&employeeId=${employeeId}&accountId=${accountId}&businessUnitId=${businessUnitId}&applicationDate=${applicationDate}&appliedFromDate=${appliedFromDate}&appliedToDate=${appliedToDate}&leaveReason=${reason}&addressDuetoLeave=${addressDueToLeaveMove}&ActionBy=${actionBy}&documentFile=${
        documentFile ? documentFile : ""
      }&startTime=${fromModifiedTime}&endTime=${toModifiedTime}`;
    }
    let res = await Axios.post(url);
    // do not remove this status code check, this is mendatory
    if (res?.data?.statuscode === 500) {
      setDisabled(false);
      return toast.warn(res?.data?.message);
    }

    toast.success(res?.data?.message);
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveMovementAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    await Axios.post(
      `/hcm/HCMMovementApplication/CreateMovementApplication`,
      data
    );
    toast.success("Submitted successfully");
    cb();
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// Update Remove leave Move data
export const removeLeaveMoveAction = async (
  payload,
  updateRowDto,
  setRowDto
) => {
  try {
    const res = await Axios.put(
      `/hcm/LeaveAndMovement/RemoveLeaveOrMovement`,
      payload?.data
    );
    toast.success(res.data?.message || "Leave/Movement remove successfully");
    setRowDto(updateRowDto);
    payload.cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
// Update Remove leave Move data
export const removeOfficialMovement_api = async (
  payload,
  updateRowDto,
  setRowDto
) => {
  try {
    const res = await Axios.put(
      `/hcm/OfficialMovement/RemoveOfficialMovement`,
      payload?.data
    );
    toast.success(res.data?.message || "Leave/Movement remove successfully");
    setRowDto(updateRowDto);
    payload.cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getLeaveMovementSelfData = (employeeId, accId, busId, setter) => {
  Axios.get(
    `/hcm/LeaveAndMovement/LeaveAndMovementLandingPagination?EmployeeId=${employeeId}&AccountId=${accId}&BusinessUnitId=${busId}&viewOrder=desc&PageNo=1&PageSize=1000`
  )
    .then((res) => {
      setter(res?.data?.data);
    })
    .catch((err) => setter([]));
};

export const getMovementSelfData = (employeeId, setter) => {
  Axios.get(
    `/hcm/OfficialMovement/OfficialMovementLandingPagination?EmployeeId=${employeeId}&PageNo=1&PageSize=123&viewOrder=desc`
  )
    .then((res) => {
      setter(res?.data?.data);
    })
    .catch((err) => setter([]));
};

export const getLeaveSummarySelfData = (employeeId, setter, setLoader) => {
  setLoader(true);
  Axios.get(
    `/hcm/LeaveAndMovement/GetEmployeeWiseLeaveBalance?EmployeeId=${employeeId}`
  )
    .then((res) => {
      setter(res?.data);
      setLoader(false);
    })
    .catch((err) => {
      setter([]);
      setLoader(false);
    });
};

export const getMovementSummarySelfData = (MoveTypeId, EmployeeId, setter) => {
  Axios.get(
    `/hcm/OfficialMovement/GetOfficialMovementByMoveTypeId?MoveTypeId=${MoveTypeId}&EmployeeId=${EmployeeId}`
  )
    .then((res) => {
      setter(res?.data);
    })
    .catch((err) => {
      setter([]);
    });
};

export const leaveMovementAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Attachment Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Something went wrong, try again");
  }
};
