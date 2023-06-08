/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";

import {
  createEmpBasicInformation_api,
  getBusinessUnitDDL,
  getCostCenterDDL,
  getDepartmentDDL,
  getDesignationDDLAction,
  getEmpStatusDDL,
  getEmpTypeDDLAction,
  getSBUDDL,
  getWorkplaceDDL_api,
  getLineManagersDDL,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { religionDDL_api } from "../../personalInformation/EditForm/collpaseComponent/personalInformation/helper";
import { toast } from "react-toastify";

const initData = {
  id: undefined,
  firstName: "",
  middleName: "",
  gender: "",
  lastName: "",
  businessUnit: "",
  SBUName: "",
  costCenter: "",
  functionalDepartment: "",
  HRposition: "",
  designation: "",
  employeeGrade: "",
  workplace: "",
  lineManager: "",
  superVisor: "",
  employeeCode: "",
  employmentType: "",
  confirmationDate: "",
  employeeStatus: "",
  // nanagerInfo: "",
  joiningDate: "",
  grossSalary: "",
  basicSalary: "",
  code: "",
  email: "",
  religion: "",
};

export default function ElmployeeInformationForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();
  // const [modalMessage, setModalMessage] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      closeOnClickOutside: false,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };

  const modalView = (modalMessage) => {
    let confirmObject = {
      title: modalMessage?.employeeName,
      message: `Enroll : ${modalMessage?.enroll} Code : ${modalMessage?.employeeCode}`,
      closeOnClickOutside: false,
      yesAlertFunc: () => {},
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const saveHandler = async (values, setShowModal, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (
        values?.employmentType?.label === "Permanent" &&
        (!values?.basicSalary || values?.basicSalary < 1)
      )
        return toast.warn("Basic Salary must be greater than zero");

      if (
        values?.employmentType?.label !== "Permanent" &&
        (!values?.grossSalary || values?.grossSalary < 1)
      )
        return toast.warn("Gross Salary must be greater than zero");

      if (
        values?.employmentType?.label === "Permanent" &&
        !values?.confirmationDate
      )
        return toast.warn("Please add Confirmation Date");
      const payload = {
        employeeCode: values?.code || "",
        employeeFirstName: "",
        middleName: "",
        lastName: "",
        employeeFullName: values?.firstName,
        accountId: profileData?.accountId,
        businessunitId: values?.businessUnit?.value,
        sbuid: values?.SBUName?.value,
        departmentId: values?.functionalDepartment?.value,
        designationId: values?.designation?.value,
        joiningDate: values?.joiningDate,
        presentAddress: "",
        permanentAddress: "",
        countryId: 0,
        contactNumber: "",
        alternativeContactNumber: "",
        email: values?.email || "",
        dateOfBirth: "2020-12-09T08:26:14.080Z",
        idtypeId: 0,
        idnumber: "",
        fatherName: "",
        motherName: "",
        bloodGroupId: 0,
        userGroupId: 0,
        supervisorId: values?.superVisor?.value || 0,
        costCenterId: values?.costCenter.value,
        workplaceGroupId: values?.workplace?.workplaceGroupId || 0,
        workplaceId: values?.workplace?.value || 0,
        positionId: values?.HRposition?.value || 0,
        empGradeId: values?.employeeGrade?.value || 0,
        employmentTypeId: values?.employmentType?.value,
        lineManagerId: values?.lineManager?.value || values?.superVisor?.value,
        lineManagerCode:
          values?.lineManager?.code || values?.superVisor?.code || "",
        employmentStatusId: 1 || values?.employeeStatus?.value,
        actionBy: profileData.userId,
        basicSalary: values?.basicSalary || 0,
        grossSalary: values?.grossSalary || 0,
        genderId: values?.gender?.value || 0,
        gender: values?.gender?.label || "",
        confirmationDate: values?.confirmationDate || "",
        religionId: values?.religion?.value,
        religion: values?.religion?.label,
      };

      createEmpBasicInformation_api(payload, cb, setDisabled, modalView);
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [SBUDDL, setSBUDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  // const [HRPositionDDL, setHRPositionDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  // const [employeeGradeDDL, setEmployeeGradeDDL] = useState([]);
  const [employeeTypeDDL, setEmployeeTypeDDL] = useState([]);
  const [employeeStatusDDL, setEmployeeStatusDDL] = useState([]);
  const [lineManagerDDl, setLineManagerDDl] = useState([]);
  const [lineManager, setLineManagerValue] = useState("");
  const [religionDDL, setReligionDDL] = useState([]);

  useEffect(() => {
    getEmpStatusDDL(setEmployeeStatusDDL);
    religionDDL_api(setReligionDDL);
  }, []);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      // getHRPositionDDL(profileData?.accountId, setHRPositionDDL);
      getBusinessUnitDDL(profileData?.accountId, setBusinessUnitDDL);
      getEmpTypeDDLAction(profileData?.accountId, selectedBusinessUnit?.value, setEmployeeTypeDDL);
      // getDepartmentDDL(selectedBusinessUnit?.value,setDepartmentDDL);
      getDepartmentDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDepartmentDDL
      );
      getDesignationDDLAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDesignationDDL
      );
      // getLineManagerDDL(profileData?.accountId, setLineManagerDDl);
      getWorkplaceDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setWorkplaceDDL
      );
      getLineManagersDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setLineManagerDDl
      );
      getSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSBUDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const subOnChangeHandler = (sbuId) => {
    getCostCenterDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      sbuId,
      setCostCenterDDL
    );
  };

  const businessUnitOnChangeHandler = (buId) => {
    getSBUDDL(profileData?.accountId, buId, setSBUDDL);
    getDesignationDDLAction(profileData?.accountId, buId, setDesignationDDL);
    getDepartmentDDL(profileData?.accountId, buId, setDepartmentDDL);
    getEmpTypeDDLAction(profileData?.accountId, buId, setEmployeeTypeDDL);
  };

  return (
    <IForm
      title={"Create Basic Information"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={{ ...initData, businessUnit: selectedBusinessUnit }}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        costCenterDDL={costCenterDDL}
        businessUnitDDL={businessUnitDDL}
        SBUDDL={SBUDDL}
        setSBUDDL={setSBUDDL}
        workplaceDDL={workplaceDDL}
        departmentDDL={departmentDDL}
        // HRPositionDDL={HRPositionDDL}
        designationDDL={designationDDL}
        // employeeGradeDDL={employeeGradeDDL}
        employeeTypeDDL={employeeTypeDDL}
        employeeStatusDDL={employeeStatusDDL}
        headerData={headerData}
        lineManagerDDl={lineManagerDDl}
        setLineManagerValue={setLineManagerValue}
        lineManager={lineManager}
        subOnChangeHandler={subOnChangeHandler}
        businessUnitOnChangeHandler={businessUnitOnChangeHandler}
        profileData={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        religionDDL={religionDDL}
      />
    </IForm>
  );
}
