import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { saveEmployeeAttendence } from "../helper";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";

const initData = {
  attendancedate: _todayDate(),
  punch: { value: 0, label: "All" },
  status: { value: 0, label: "All" },
  department: { value: 0, label: "All" },
  employeeName: "",
  workplaceGroup: { value: 0, label: "All" },
  jobType: { value: 0, label: "All" },
  isConsidered: false,
  attendanceWill:"",
};

export default function UpdateEmployeeAttendenceForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  //row dataSourceDDL
  const [rowDto, setRowDto] = useState([]);

  const saveHandler = async (values, cb) => {
    const items = rowDto.filter((item) => item.isSelect);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (!values?.attendanceWill)
        return toast.warn("Please select attendance will");

      if (items?.length === 0) {
        toast.error('Please select at least one "Employee Attendance"');
      } else {
        const payload = items?.map((data) => {
          return {
            accountId: profileData.accountId,
            businessUnitId: values?.businessUnit?.value,
            departmentId: values?.department?.value,
            attendanceDate: values?.attendancedate,
            employeeId: data?.employeeId,
            employeeCode: data?.employeeCode,
            lineManagerId: data?.lineManagerId || 0,
            lastAttendanceStatus:
              data?.attendenceStatus === "-"
                ? data?.actualAttendenceStatus
                : data?.attendenceStatus,
            updatedAttendanceStatus: values?.attendanceWill?.label,
            actionBy: profileData.userId,
            isModifyByConsider: values?.isConsidered,
            punchInTime: _timeFormatter(data?.inTime || ""),
            punchOutTime: _timeFormatter(data?.outTime || ""),
          };
        });

        saveEmployeeAttendence(payload, cb, setRowDto);
      }
    } else {
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div>
      <IForm
        title="Update Employee Attendance"
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
          rowDto={rowDto}
          setRowDto={setRowDto}
          setDisabled={setDisabled}
        />
      </IForm>
    </div>
  );
}
