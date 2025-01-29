import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router-dom";

import {
  createEmpBasicInformation_api,
  getBusinessUnitDDL,
  getCostCenterDDL,
  getDepartmentDDL,
  getDesignationDDL,
  getEmployeeGradeDDL,
  getEmpStatusDDL,
  getEmpTypeDDL,
  getHRPositionDDL,
  getSBUDDL,
  getWorkplaceDDL_api,
  getLineManagerDDL,
  getEmpGroupDDL,
  empAttachment_action,
} from "../helper";

const initData = {
  id: undefined,
  firstName: "",
  middleName: "",
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
  employeeCode: "",
  employmentType: "",
  employeeStatus: "",
  nanagerInfo: "",
  joiningDate: "",
  empLavel: "",
  empProfileImage: "",
};

export default function SalesForceElmployeeInformationForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();

  // iamge attachment
  const [fileObjects, setFileObjects] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        employeeFirstName: values?.firstName,
        middleName: values?.middleName,
        lastName: values?.lastName,
        employeeFullName:
          values?.firstName + " " + values?.middleName + " " + values?.lastName,
        accountId: profileData?.accountId,
        businessunitId: selectedBusinessUnit?.value,
        sbuid: values?.SBUName?.value,
        departmentId: values?.functionalDepartment?.value,
        designationId: values?.designation?.value,
        //costCenterId: values?.costCenter?.value,
        workPlaceId: values?.workplace?.value,
        joiningDate: values?.joiningDate,
        positionId: values.HRposition.value,
        empGradeId: values.employeeGrade.value,
        employmentTypeId: values?.employmentType.value,
        lineManagerId: values?.lineManager.value,
        lineManagerCode: values?.nanagerInfo,
        employeeLevelId: values?.empLavel?.value,
        employeeStatusId: values?.employeeStatus.value,
        actionBy: profileData?.userId,
      };

      if (fileObjects.length > 0) {
        empAttachment_action(fileObjects).then((data) => {
          const modifyPlyload = {
            ...payload,
            empProfileImage: data[0]?.id || "",
          };
          createEmpBasicInformation_api(modifyPlyload, cb, setDisabled);
        });
      } else {
        const modifyPlyload = {
          ...payload,
          empProfileImage: "",
        };
        createEmpBasicInformation_api(modifyPlyload, cb, setDisabled);
      }
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
  const [HRPositionDDL, setHRPositionDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [employeeGradeDDL, setEmployeeGradeDDL] = useState([]);
  const [employeeTypeDDL, setEmployeeTypeDDL] = useState([]);
  const [employeeStatusDDL, setEmployeeStatusDDL] = useState([]);
  const [lineManagerDDl, setLineManagerDDl] = useState([]);
  const [lineManager, setLineManagerValue] = useState("");
  const [empLavelDDL, SetempLavelDDL] = useState([]);

  useEffect(() => {
    if (profileData?.accountId) {
      getBusinessUnitDDL(setBusinessUnitDDL);
      getDepartmentDDL(setDepartmentDDL);
      getHRPositionDDL(setHRPositionDDL);
      getDesignationDDL(setDesignationDDL);
      getEmployeeGradeDDL(setEmployeeGradeDDL);

      getEmpStatusDDL(setEmployeeStatusDDL);
    }
  }, [profileData]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getLineManagerDDL(profileData?.accountId, setLineManagerDDl);
      getWorkplaceDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setWorkplaceDDL
      );
      getEmpGroupDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        SetempLavelDDL
      );
      getEmpTypeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeTypeDDL
      );
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
  };
  return (
    <IForm
      title={"Create Sales Force Profile"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {/* {isDisabled && <Loading />} */}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        costCenterDDL={costCenterDDL}
        businessUnitDDL={businessUnitDDL}
        SBUDDL={SBUDDL}
        workplaceDDL={workplaceDDL}
        departmentDDL={departmentDDL}
        HRPositionDDL={HRPositionDDL}
        designationDDL={designationDDL}
        employeeGradeDDL={employeeGradeDDL}
        employeeTypeDDL={employeeTypeDDL}
        employeeStatusDDL={employeeStatusDDL}
        headerData={headerData}
        lineManagerDDl={lineManagerDDl}
        setLineManagerValue={setLineManagerValue}
        lineManager={lineManager}
        subOnChangeHandler={subOnChangeHandler}
        businessUnitOnChangeHandler={businessUnitOnChangeHandler}
        empLavelDDL={empLavelDDL}
        // image attachment
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
      />
    </IForm>
  );
}
