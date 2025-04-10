import Axios from 'axios';
import { toast } from 'react-toastify';

export const getEmpInfoById = async (valueOption, setFieldValue, fieldName) => {
  try {
    let res = await Axios.get(
      `/hcm/HCMDDL/GetEmployeeDetailsByEmpId?EmpId=${valueOption?.value}`
    );
    let {
      employeeInfoDesignation,
      employeeBusinessUnit,
      employeeInfoDepartment,
    } = res?.data;
    setFieldValue(
      'employeeInfo',
      `${employeeInfoDesignation},${employeeInfoDepartment},${employeeBusinessUnit}`
    );
    setFieldValue(fieldName, { ...valueOption, ...res?.data });
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
    const res = await Axios.get(`/hcm/HCMDDL/GetBDAllDistrictDDL`);
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
    console.log(res?.data, 'res?.data');
    setter(data?.data);
    setLoader(false);
  } catch (error) {
    setter([]);
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
      return toast.warn('Time is required');
    setDisabled(true);

    let fromModifiedTime = tmStart || null;
    let toModifiedTime = tmEnd || null;

    let url = `/hcm/HCMLeaveApplication/LeaveApplication?leaveTypeId=${typeId}&employeeId=${employeeId}&accountId=${accountId}&businessUnitId=${businessUnitId}&applicationDate=${applicationDate}&appliedFromDate=${appliedFromDate}&appliedToDate=${appliedToDate}&leaveReason=${reason}&addressDuetoLeave=${addressDueToLeaveMove}&ActionBy=${actionBy}&documentFile=${
      documentFile ? documentFile : ''
    }`;

    if (fromModifiedTime && toModifiedTime) {
      url = `/hcm/HCMLeaveApplication/LeaveApplication?leaveTypeId=${typeId}&employeeId=${employeeId}&accountId=${accountId}&businessUnitId=${businessUnitId}&applicationDate=${applicationDate}&appliedFromDate=${appliedFromDate}&appliedToDate=${appliedToDate}&leaveReason=${reason}&addressDuetoLeave=${addressDueToLeaveMove}&ActionBy=${actionBy}&documentFile=${
        documentFile ? documentFile : ''
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
    toast.success('Submitted successfully');
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
    toast.success(res.data?.message || 'Leave/Movement remove successfully');
    setRowDto(updateRowDto);
    payload.cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
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
