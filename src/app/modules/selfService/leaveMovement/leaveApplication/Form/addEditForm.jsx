import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import { empAttachment_action } from '../../../../_helper/attachmentUpload';
import { saveLeaveMovementAction, saveMovementAction } from '../helper';
import Form from './form';

const initData = {
  id: undefined,
  leaveType: 1,
  employeeName: '',
  employeeInfo: '',
  reasonType: '',
  fromDate: _todayDate(),
  fromTime: '',
  toDate: _todayDate(),
  toTime: '',
  reason: '',
  address: '',
};

export function LeaveAddForm({
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
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
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
            phoneDueToLeaveMove: '',
            actionBy: profileData?.userId,
            isPaid: 0,
            approvedStatus: '',
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
            empAttachment_action(fileObjects).then((data) => {
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
      title="Create Leave Application"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
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
