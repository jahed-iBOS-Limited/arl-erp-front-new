/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import {
  createAdministrativeInformation_api,
  getEmployeeUnionDDL,
  getEmpRemunerationIdDDL,
  getOrganizationComponentDDL,
  getOrganizationStructureDDL,
  getPayrollGroupDDL,
  getRemunerationTypeDDL,
  editAdministrativeInformation_api,
  getCalenderDDL_api,
  getCalenderRoasterDDL_api,
  getEployeeGroupDDL,
  createRoasterSetup_api,
  getRoasterSetupInfoById_api,
} from "./helper";
import { _todayDate } from "./../../../../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { empAttachment_action } from "../../../helper";
import { useLocation } from "react-router-dom";
import { getImageFile_api } from "./../../../helper";
import Loading from "./../../../../../../_helper/_loading";
import "./style.css";
import { toast } from "react-toastify";

const initData = {
  generateDate: _todayDate(),
  calenderType: "",
  calender: "",
  startingCalender: "",
  nextChangeDate: _todayDate(),
};

export default function RoasterSetup({basicDataSave}) {
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

  const saveHandler = async (values, cb) => {

    if(!values?.generateDate) return toast.warn("Generate date is required")


    if(!basicDataSave?.joiningDate) return toast.warn("Joining date not found in employee basic info")



    if(values?.generateDate < basicDataSave?.joiningDate) return toast.warn("Can not generate roster before joining date")

    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      //edit api check
      if (singleData) {
        //edit api
        console.log("values", values);
        createRoasterSetup_api(
          headerData?.employeeId,
          values?.generateDate,
          profileData?.userId,
          values?.calenderType?.value === 2
            ? values?.startingCalender?.value
            : values?.calender?.value,
          values?.nextChangeDate,
          values?.calenderType?.label,
          values?.calenderType?.value === 2 ? values?.calender?.value : 0,
          cb,
          setDisabled,
          getRosterByIdCb
        );
      } else {
        //create api
        createRoasterSetup_api(
          headerData?.employeeId,
          values?.generateDate,
          profileData?.userId,
          values?.calenderType?.value === 2
            ? values?.startingCalender?.value
            : values?.calender?.value,
          values?.nextChangeDate || "",
          values?.calenderType?.label,
          values?.calenderType?.value === 2 ? values?.calender?.value : 0,
          cb,
          setDisabled
        );
      }
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    getRoasterSetupInfoById_api(headerData?.employeeId, setSingleData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRosterByIdCb = () => {
    getRoasterSetupInfoById_api(headerData?.employeeId, setSingleData);
  };

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
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (singleData) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [singleData]);
  return (
    <div className="employeeInformation official-info-work-schedule">
      {isDisabled && <Loading />}
      <Form
        initData={singleData || initData}
        saveHandler={saveHandler}
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
        getRosterByIdCb={getRosterByIdCb}
      />
    </div>
  );
}
