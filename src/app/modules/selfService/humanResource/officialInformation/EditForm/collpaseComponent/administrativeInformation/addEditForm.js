/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import {
  getEmployeeUnionDDL,
  getEmpRemunerationIdDDL,
  getOrganizationComponentDDL,
  getOrganizationStructureDDL,
  getPayrollGroupDDL,
  getRemunerationTypeDDL,
  editAdministrativeInformation_api,
  getAdministrativeInfoById_api,
  getCalenderDDL_api,
  getCalenderRoasterDDL_api,
  getEployeeGroupDDL,
  createAdministrativeInformation_api,
} from "./helper";
import { _todayDate } from "./../../../../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { empAttachment_action } from "../../../helper";
import { useLocation } from "react-router-dom";
import { getImageFile_api } from "./../../../helper";
import Loading from "./../../../../../../_helper/_loading";
import { toast } from "react-toastify";

const initData = {
  generateDate: _todayDate(),
  payrollGroup: "",
  calenderType: "",
  calender: "",
  employeeUnion: "",
  organizationStructure: "",
  organizationComponent: "",
  remunerationType: "",
  employeeRemunerationId: "",
  cardNo: "",
  comments: "",
  dateOfJoining: "",
  joiningLetter: "",
  employeeGroup: "",
  startingCalender: "",
  nextChangeDate: _todayDate(),
};

export default function AdministrativeInformation({ basicDataSave }) {
  const [payrollGroupDDL, setPayrollGroupDDL] = useState([]);
  const [employeeUnionDDL, setEmployeeUnionDDL] = useState([]);
  const [organizationStructureDDL, setOrganizationStructureDDL] = useState([]);
  const [organizationComponentDDL, setOrganizationComponentDDL] = useState([]);
  const [remunerationTypeDDL, setRemunerationTypeDDL] = useState([]);
  const [calenderDDL, setCalenderDDL] = useState([]);
  const [calenderRoasterDDL, setCalenderRoasterDDL] = useState([]);
  const [employeeGroupDDL, setEmployeeGroupDDL] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [runningCalender, setRunningCalender] = useState([]);
  //fileObjects
  const [fileObjects, setFileObjects] = useState([]);
  const [edit, setEdit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getAdministrativeInfoById_api(headerData?.employeeId, setSingleData);
  }, [basicDataSave]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      //edit api check
      if (singleData) {
        //edit api
        const payload = {
          administrativeId: singleData.administrativeId || 0,
          employeeId: headerData?.employeeId,
          intEmployeeGroupId: +values?.employeeGroup?.value,
          strEmployeeGroup: values?.employeeGroup?.label,
          payrollGroupId: values?.payrollGroup?.value,
          calenderId: 0,
          employeeUnionId: values?.employeeUnion?.value || 0,
          orgStructureId: values?.organizationStructure?.value || 0,
          orgComponentId: values?.organizationComponent?.value || 0,
          remunerationTypeId: values?.remunerationType?.value,
          cardNo: values?.cardNo || "",
          strCalenderType: "",
          comments: values?.comments,
          joiningLetterLink: values?.joiningLetter || "",
          cardInfoLink: "",
          actionBy: profileData.userId,
        };
        if (fileObjects.length > 0) {
          empAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              ...payload,
              joiningLetterLink: data[0]?.id || "",
            };
            editAdministrativeInformation_api(modifyPlyload, setDisabled).then(
              (data) => {
                setFileObjects([]);
                getAdministrativeInfoById_api(
                  headerData?.employeeId,
                  setSingleData
                );
              }
            );
          });
        } else {
          editAdministrativeInformation_api(payload, setDisabled).then(
            (data) => {
              setFileObjects([]);
              getAdministrativeInfoById_api(
                headerData?.employeeId,
                setSingleData
              );
            }
          );
        }
      } else {
        //create api
        const payload = {
          employeeId: headerData?.employeeId,
          intEmployeeGroupId: +values?.employeeGroup?.value,
          strEmployeeGroup: values?.employeeGroup?.label,
          employeeCode: headerData?.employeeCode,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          hrgroupId: 0,
          payrollGroupId: values?.payrollGroup?.value,
          calenderId: 0,
          employeeUnionId: values?.employeeUnion?.value || 0,
          orgStructureId: values?.organizationStructure?.value || 0,
          orgComponentId: values?.organizationComponent?.value || 0,
          remunerationTypeId: values?.remunerationType?.value,
          departmentId: 0,
          designationId: 0,
          cardNo: values?.cardNo || "",
          strCalenderType: "",
          comments: values?.comments,
          joiningLetterLink: "",
          cardInfoLink: "",
          actionBy: profileData?.userId,
        };
        if (fileObjects.length > 0) {
          empAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              ...payload,
              joiningLetterLink: data[0]?.id || "",
            };
            createAdministrativeInformation_api(
              modifyPlyload,
              cb,
              setDisabled
            ).then((data) => {
              setFileObjects([]);
              getAdministrativeInfoById_api(
                headerData?.employeeId,
                setSingleData
              );
            });
          });
        } else {
          createAdministrativeInformation_api(payload, cb, setDisabled).then(
            (data) => {
              setFileObjects([]);
              getAdministrativeInfoById_api(
                headerData?.employeeId,
                setSingleData
              );
            }
          );
        }
      }
    }
  };

  //FETCHING ALL DATA FROM helper.js
  useEffect(() => {
    if (edit) {
      getPayrollGroupDDL(setPayrollGroupDDL);
      getEmployeeUnionDDL(setEmployeeUnionDDL);
      getOrganizationStructureDDL(setOrganizationStructureDDL);
      getOrganizationComponentDDL(setOrganizationComponentDDL);
      getRemunerationTypeDDL(setRemunerationTypeDDL);
    }
  }, [edit]);

  useEffect(() => {
    getAdministrativeInfoById_api(headerData?.employeeId, setSingleData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getCalenderDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCalenderDDL
      );
      setCalenderRoasterDDL([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getCalenderRoasterDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCalenderRoasterDDL
      );
      setCalenderDDL([]);
      // getCalenderDDL_api(
      //   profileData?.accountId,
      //   selectedBusinessUnit?.value,
      //   setCalenderDDL
      // );
    }

    // getCalenderDDL_api(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   setCalenderRoasterDDL
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // get employee group ddl
    getEployeeGroupDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setEmployeeGroupDDL
    );
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (singleData) {
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
        payrollGroupDDL={payrollGroupDDL}
        employeeUnionDDL={employeeUnionDDL}
        organizationStructureDDL={organizationStructureDDL}
        organizationComponentDDL={organizationComponentDDL}
        remunerationTypeDDL={remunerationTypeDDL}
        setEdit={setEdit}
        edit={edit}
        isDisabled={isDisabled}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        calenderDDL={calenderDDL}
        calenderRoasterDDL={calenderRoasterDDL}
        employeeGroupDDL={employeeGroupDDL}
        setEmployeeGroupDDL={setEmployeeGroupDDL}
        runningCalender={runningCalender}
        setRunningCalender={setRunningCalender}
      />
    </div>
  );
}
