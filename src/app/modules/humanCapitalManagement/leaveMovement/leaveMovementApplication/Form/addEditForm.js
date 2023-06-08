/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  leaveMovementAttachment_action,
  saveLeaveMovementAction,
  saveMovementAction,
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useLocation } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { setLeaveMovementDataAction } from "../../../../_helper/reduxForLocalStorage/Actions";

// const initData = {
//   id: undefined,
//   leaveType: 1,
//   employeeName: "",
//   employeeInfo: "",
//   reasonType: "",
//   fromDate: _todayDate(),
//   fromTime: "",
//   toDate: _todayDate(),
//   toTime: "",
//   reason: "",
//   address: "",
// };

export function LeaveMovementAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const location = useLocation();
  //fileObjects
  const [fileObjects, setFileObjects] = useState([]);


  // get user profile data from store
  const {profileData, selectedBusinessUnit} = useSelector((state) => {
    return state.authData;
  }, shallowEqual);


  const {leaveMovementApp} = useSelector((state) => {
    return state.localStorage;
  }, shallowEqual);

  const dispatch = useDispatch();

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      dispatch(setLeaveMovementDataAction(values))
      if (id) {
      } else {
        if (values?.leaveType === 1) {
          const payload = {
            typeId: values?.reasonType?.value,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            employeeId: values?.employeeName?.value,
            applicationDate: _todayDate(),
            appliedFromDate: _dateFormatter(values?.fromDate),
            appliedToDate: _dateFormatter(values?.toDate),
            documentFile: null,
            reason: values?.reason,
            addressDueToLeaveMove: values?.address,
            phoneDueToLeaveMove: "",
            actionBy: profileData?.userId,
            isPaid: 0,
            approvedStatus: "",
            approvedBy: 0,
            ysnHalfDayLeave: true,
            ysnApproved: false,
            ysnRejected: false,
            intActionBy: profileData?.userId,
            dteAction: _todayDate(),
            tmStart: values?.fromTime,
            tmEnd: values?.toTime,
            ysnPaid: true,
          };

          if (fileObjects.length > 0) {
            //  Attachment file add
            leaveMovementAttachment_action(fileObjects).then((data) => {
              const modifyPlyload = {
                ...payload,
                documentFile: data[0]?.id || null,
              };
              saveLeaveMovementAction(modifyPlyload, cb, setDisabled);
            });
          } else {
            //  Attachment file not add
            saveLeaveMovementAction(payload, cb, setDisabled);
          }
        } else {
          const movments = {
            employeeId: values?.employeeName?.value,
            moveTypeId: values?.reasonType?.value,
            startDate: values?.fromDate,
            startTime: values?.fromTime,
            endDate: values?.toDate,
            endTime: values?.toTime,
            countryId: 18,
            address: values?.address,
            districtId: 0,
            reason: values?.reason,
            approvedBy: 0,
            insertDateTime: _todayDate(),
            isApproved: false,
            isRejected: false,
            ActionBy: profileData?.userId,
          };
          saveMovementAction(movments, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Leave/Movement Application"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={leaveMovementApp}
          saveHandler={saveHandler}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          location={location}
          isEdit={id || false}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          // employeeValue={employeeValue}
          // setEmployeeValue={setEmployeeValue}
        />
      </div>
    </IForm>
  );
}
