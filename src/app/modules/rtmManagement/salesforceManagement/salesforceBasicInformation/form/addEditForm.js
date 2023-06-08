/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import {
  getSalesForceInfoById,
  createSalesForceInfo,
  editSalesForceInfo,
  // All DDL
  getDesignationDDL,
  getSbuDDL,
  getDepartmentDDL,
  getWorkplaceGroupDDL,
  getHrPostionDDL,
  getEmpGradeDDL,
  getEmpTypeDDL,
  getLineManagerDDL,
  getBloodGroupDDL,
} from "../helper";

const initData = {
  // DDL
  designation: "",
  sbu: "",
  department: "",
  workplaceGroup: "",
  hrPostion: "",
  empGrade: "",
  empType: "",
  lineManager: "",
  empLavel: "",
  bloodGroup: "",

  // Basic Info
  employeeFirstName: "",
  middleName: "",
  lastName: "",
  joiningDate: "",
  presentAddress: "",
  permanentAddress: "",
  dateOfBirth: "",
  fatherName: "",
  motherName: "",
  email: "",
  contactNumber: "",
  alternativeContactNumber: "",
};

const SalesForceInfoForm = () => {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

  // All DDL
  const [desinationDDL, setDesinationDDL] = useState("");
  const [sbuDDL, setSbuDDL] = useState("");
  const [departmentDDL, setDepartmentDDL] = useState("");
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState("");
  const [hrPostionDDL, setHrPostionDDL] = useState("");
  const [empGradeDDL, setEmpGradeDDL] = useState("");
  const [empTypeDDL, setEmpTypeDDL] = useState("");
  const [lineManagerDDL, setLineManagerDDL] = useState("");
  const [empLavelDDL, setEmpLavelDDL] = useState("");
  const [bloodGroupDDL, setBloodGroupDDL] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Fetch All DDL
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDesignationDDL(setDesinationDDL);
      getSbuDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
      getDepartmentDDL(setDepartmentDDL);
      getWorkplaceGroupDDL(setWorkplaceGroupDDL);
      getHrPostionDDL(setHrPostionDDL);
      getEmpGradeDDL(setEmpGradeDDL);
      getEmpTypeDDL(setEmpTypeDDL);
      getLineManagerDDL(setLineManagerDDL);
      getBloodGroupDDL(setBloodGroupDDL);
      // Employee Lavel DDL is static
      setEmpLavelDDL([
        {
          value: "Level-1",
          label: "Level-1",
        },
        {
          value: "Level-2",
          label: "Level-2",
        },
        {
          value: "Level-3",
          label: "Level-3",
        },
      ]);
    }
  }, [profileData?.accountId && selectedBusinessUnit?.value]);

  // Get Single Data By Id
  useEffect(() => {
    if (id) {
      getSalesForceInfoById(id, setDisabled, setSingleData);
    }
  }, [id]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // Create
      if (!id) {
        const payload = {
          employeeFirstName: values?.employeeFirstName,
          middleName: values?.middleName,
          lastName: values?.lastName,
          employeeFullName:
            values?.employeeFirstName +
            " " +
            values?.middleName +
            " " +
            values?.lastName,
          accountId: profileData?.accountId,
          businessunitId: selectedBusinessUnit?.value,
          sbuid: +values?.sbu?.value,
          departmentId: +values?.department?.value,
          designationId: +values?.designation?.value,
          joiningDate: values?.joiningDate,
          presentAddress: values?.presentAddress,
          permanentAddress: values?.permanentAddress,
          contactNumber: values?.contactNumber,
          alternativeContactNumber: values?.alternativeContactNumber,
          email: values?.email,
          dateOfBirth: values?.dateOfBirth,
          fatherName: values?.fatherName,
          motherName: values?.motherName,
          bloodGroupId: +values?.bloodGroup?.value,
          workplaceGroupId: +values?.workplaceGroup?.value,
          positionId: +values?.hrPostion?.value,
          empGradeId: +values?.empGrade?.value,
          employmentTypeId: +values?.empType?.value,
          lineManagerId: +values?.lineManager?.value,
          lineManagerCode: values?.lineManager?.code,
          employeeLevel: values?.empLavel?.label,
          actionBy: profileData?.userId,
        };
        createSalesForceInfo(payload, setDisabled, cb);
      }
      // Edit
      else {
        const payload = {
          employeeId: +id,
          employeeFirstName: values?.employeeFirstName,
          middleName: values?.middleName,
          lastName: values?.lastName,
          employeeFullName:
            values?.employeeFirstName +
            " " +
            values?.middleName +
            " " +
            values?.lastName,
          departmentId: +values?.department?.value,
          designationId: +values?.designation?.value,
          joiningDate: values?.joiningDate,
          presentAddress: values?.presentAddress,
          permanentAddress: values?.permanentAddress,
          contactNumber: values?.contactNumber,
          alternativeContactNumber: values?.alternativeContactNumber,
          email: values?.email,
          dateOfBirth: values?.dateOfBirth,
          fatherName: values?.fatherName,
          motherName: values?.motherName,
          bloodGroupId: +values?.bloodGroup?.value,
          workplaceGroupId: +values?.workplaceGroup?.value,
          positionId: +values?.hrPostion?.value,
          empGradeId: +values?.empGrade?.value,
          employmentTypeId: +values?.empType?.value,
          lineManagerId: +values?.lineManager?.value,
          lineManagerCode: values?.lineManager?.code,
          employeeLevel: values?.empLavel?.label,
          actionBy: profileData?.userId,
        };
        editSalesForceInfo(payload, setDisabled);
      }
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={
          !id ? "Add Salesforce Information" : "Edit Salesforce Information"
        }
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isEdit={id}
          // All DDL
          designationDDL={desinationDDL}
          sbuDDL={sbuDDL}
          departmentDDL={departmentDDL}
          workplaceGroupDDL={workplaceGroupDDL}
          hrPostionDDL={hrPostionDDL}
          empGradeDDL={empGradeDDL}
          empTypeDDL={empTypeDDL}
          lineManagerDDL={lineManagerDDL}
          empLavelDDL={empLavelDDL}
          bloodGroupDDL={bloodGroupDDL}
        />
      </IForm>
    </>
  );
};

export default SalesForceInfoForm;
