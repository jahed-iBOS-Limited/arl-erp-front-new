/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import {
  getNationalityDDL,
  getBloodGroupDDL,
  getGenderDDL,
  getEmpIdentificationTypeDDL,
  religionDDL_api,
  getMeritalStatusDDL_api,
  createEmployeePersonalInformation,
  getEmpPersonalInfoById_api,
  employeePersonalInformation_api,
} from "./helper";
import { _todayDate } from "./../../../../../../../_helper/_todayDate";
import { empAttachment_action } from "../../../../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import { getImageFile_api } from "./../../../../helper";
import Loading from "./../../../../../../../_helper/_loading";
const initData = {
  employeeNickName: "",
  nationality: "",
  dateOfBirth: "",
  placeofBirth: "",
  identificationType: "",
  identificationNo: "",
  gender: "",
  religion: "",
  bloodGroup: "",
  height: "",
  weight: "",
  emailPersonal: "",
  employeeTINNo: "",
  personalContactNo: "",
  alternativeContactNo: "",
  residenceContactNo: "",
  maritalStatus: "",
  dateofMarriage: "",
  photograph: "",
  cv: "",
  identificationDoc: "",
};

export default function PersonalInformation() {
  const [edit, setEdit] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();
  // ddl
  const [nationalityDDL, setNationalityDDL] = useState([]);
  const [bloodGroupDDL, setBloodGroupDDL] = useState([]);
  const [genderDDL, setGenderDDL] = useState([]);
  const [identificationTypeDDL, setIdentificationTypeDDL] = useState([]);
  const [religionDDL, setReligionDDL] = useState([]);
  const [meritalStatusDDL, setMeritalStatusDDL] = useState([]);
  const [singleData, setSingleData] = useState("");
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
      if (singleData) {
        const payload = {
          personalInfoId: singleData.personalInfoId || 0,
          employeeId: headerData?.employeeId,
          employeeCode: headerData?.employeeCode,
          employeeNickName: values?.employeeNickName,
          natinalityId: values?.nationality?.value,
          natinalityName: values?.nationality?.label,
          dateOfBirth: values?.dateOfBirth,
          placeOfBirth: values?.placeofBirth,
          identificationTypeId: values?.identificationType?.value,
          identificationType: values?.identificationType?.label,
          identificationNo: values?.identificationNo,
          genderId: values?.gender?.value,
          gender: values?.gender?.label,
          religionId: values?.religion?.value,
          religion: values?.religion?.label,
          bloodGroupId: values?.bloodGroup?.value,
          bloodGroupName: values?.bloodGroup?.label,
          heightCm: +values?.height,
          weightKg: +values?.weight,
          personalEmail: values?.emailPersonal,
          employeeTinno: values?.employeeTINNo,
          personalContact: values?.personalContactNo,
          alternateContact: values?.alternativeContactNo,
          residenceContact: values?.residenceContactNo,
          maritalStatusId: values?.maritalStatus?.value,
          maritalStatus: values?.maritalStatus?.label,
          dateOfMarriage: values?.dateofMarriage || "",
          photographLink: "",
          cvlink: "",
          identificationDocLink: values?.identificationDoc,
          actionBy: profileData.userId,
        };
        if (fileObjects.length > 0) {
          empAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              ...payload,
              identificationDocLink: data[0]?.id || "",
            };
            employeePersonalInformation_api(modifyPlyload, setDisabled).then(
              (data) => {
                getEmpPersonalInfoById_api(
                  headerData?.employeeId,
                  setSingleData
                );
                setFileObjects([]);
              }
            );
          });
        } else {
          employeePersonalInformation_api(payload, setDisabled).then((data) => {
            getEmpPersonalInfoById_api(headerData?.employeeId, setSingleData);
            setFileObjects([]);
          });
        }
      } else {
        const payload = {
          employeeId: headerData?.employeeId,
          employeeCode: headerData?.employeeCode,
          employeeNickName: values?.employeeNickName,
          natinalityId: values?.nationality?.value,
          natinalityName: values?.nationality?.label,
          dateOfBirth: values?.dateOfBirth,
          placeOfBirth: values?.placeofBirth,
          identificationTypeId: values?.identificationType?.value,
          identificationType: values?.identificationType?.label,
          identificationNo: values?.identificationNo,
          genderId: values?.gender?.value,
          gender: values?.gender?.label,
          religionId: values?.religion?.value,
          religion: values?.religion?.label,
          bloodGroupId: values?.bloodGroup?.value,
          bloodGroupName: values?.bloodGroup?.label,
          heightCm: +values?.height,
          weightKg: +values?.weight,
          personalEmail: values?.emailPersonal,
          employeeTinno: values?.employeeTINNo,
          personalContact: values?.personalContactNo,
          alternateContact: values?.alternativeContactNo,
          residenceContact: values?.residenceContactNo,
          maritalStatusId: values?.maritalStatus?.value,
          maritalStatus: values?.maritalStatus?.label,
          dateOfMarriage: values?.dateofMarriage || _todayDate(),
          photographLink: "",
          cvlink: "",
          identificationDocLink: "",
          actionBy: profileData.userId,
        };
        if (fileObjects.length > 0) {
          empAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              ...payload,
              identificationDocLink: data[0]?.id || "",
            };
            createEmployeePersonalInformation(
              modifyPlyload,
              cb,
              setDisabled
            ).then((data) => {
              getEmpPersonalInfoById_api(headerData?.employeeId, setSingleData);
              setFileObjects([]);
            });
          });
        } else {
          createEmployeePersonalInformation(payload, cb, setDisabled).then(
            (data) => {
              getEmpPersonalInfoById_api(headerData?.employeeId, setSingleData);
              setFileObjects([]);
            }
          );
        }
      }
    } else {
      setDisabled(false);
      console.log(values);
    }
  };

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    if (edit) {
      getNationalityDDL(setNationalityDDL);
      getBloodGroupDDL(setBloodGroupDDL);
      getGenderDDL(setGenderDDL);
      
      religionDDL_api(setReligionDDL);
      getMeritalStatusDDL_api(setMeritalStatusDDL);
    }
    getEmpIdentificationTypeDDL(setIdentificationTypeDDL);
  }, [edit]);

  useEffect(() => {
    getEmpPersonalInfoById_api(headerData?.employeeId, setSingleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleData > 0) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [singleData]);

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={singleData || initData}
        saveHandler={saveHandler}
        nationalityDDL={nationalityDDL}
        bloodGroupDDL={bloodGroupDDL}
        genderDDL={genderDDL}
        identificationTypeDDL={identificationTypeDDL}
        setEdit={setEdit}
        edit={edit}
        religionDDL={religionDDL}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        meritalStatusDDL={meritalStatusDDL}
        isDisabled={isDisabled}
        singleData={singleData}
      />
    </div>
  );
}
