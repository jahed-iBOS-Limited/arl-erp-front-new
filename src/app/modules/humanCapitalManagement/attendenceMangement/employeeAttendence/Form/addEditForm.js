/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { getSupervisorDDL, saveEmployeeAttendence } from "../helper";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";

var today = new Date();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

const initData = {
  supervisorList: "",
  attendancedate: _todayDate(),
};

export default function EmployeeAttendenceForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Supervisor List DDL
  const [superVisorDDL, setSuperVisorDDL] = useState([]);
  //row dataSourceDDL
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    getSupervisorDDL(
      profileData.accountId,
      selectedBusinessUnit.value,
      setSuperVisorDDL
    );
  }, [selectedBusinessUnit.value]);

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = value;
    setRowDto(data);
  };

  const allGridCheck = (value) => {
    const modifyRowData = rowDto?.map((item) => ({
      ...item,
      presentStatus: value,
    }));
    setRowDto(modifyRowData);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      console.log(rowDto);
      if (rowDto.length === 0) {
        toast.error("Please Select Supervisor");
      } else {
        const payload = rowDto.map((data) => {
          return {
            employeeId: data.employeeId,
            dteAttendanceDate: values?.attendancedate,
            dteAttendanceTime: time,
            userId: profileData.userId,
            ysnPresent: data.presentStatus,
            present: data.currentStatus,
          };
        });
        // .filter((data) => data.present === '-')
        saveEmployeeAttendence(payload, cb, setRowDto, setDisabled);
      }
    } else {
      
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div>
      <IForm
        title="Employee Attendance"
        getProps={setObjprops}
        isDisabled={isDisabled}
        isHiddenBack
        isHiddenReset
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isEdit={id || false}
          id={id}
          setDisabled={setDisabled}
          rowDto={rowDto}
          superVisorDDL={superVisorDDL}
          rowDtoHandler={rowDtoHandler}
          setRowDto={setRowDto}
          allGridCheck={allGridCheck}
          isChecked={isChecked}
        />
      </IForm>
    </div>
  );
}
