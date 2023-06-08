import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getCalenderDDL,
  getEmployeeDDL,
  saveRoster,
  getSingleData,
  editRoster_api,
} from "../helper";
import { toast } from "react-toastify";
import { nextMonth } from "../../../../_helper/nextMonth";
import Loading from "../../../../_helper/_loading";

const initData = {
  employee: "",
  rotation: false, // true
  calender: "",
  noOfChangeDays: "",
  nextChangeDate: "",
  nextCalender: "",
  // runningCalender: false,
  rosterGroupName: "",
};

export default function RosterForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [calenderList, setCalenderList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [initDataForEdit, setInitDataForEdit] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getCalenderDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCalenderList
    );
    getEmployeeDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setEmployeeList
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  useEffect(() => {
    if (id) {
      getSingleData(id, setRowDto, setInitDataForEdit, setDisabled);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setter = (values) => {
    setRowDto([...rowDto, values]);
  };

  const remover = (i) => {
    const filterData = rowDto.filter((item, index) => i !== index);
    setRowDto(filterData);
  };

  const saveHandler = (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // Check Rowdata  length
      if (rowDto?.length < 2) return toast.warn("Please add atleast two calender");

      let firstRowCalId = rowDto[0]?.calender?.value;
      let lastRowNextCalId = rowDto[rowDto?.length - 1]?.nextCalender?.value;

      // firstRowCalId and lastRowNextCalId should be equal
      if (firstRowCalId !== lastRowNextCalId)
        return toast.warn("Invalid circle");

      let payload = rowDto?.map((item) => ({
        // intEmployeeId: item?.employee?.value,
        intCalendarId: item?.calender?.value,
        strCalendarName: item?.calender?.label,
        intNoOfDaysChange: item?.noOfChangeDays,
        dteNextChangeDate: item?.nextChangeDate || nextMonth(),
        intNextCalenderId: item?.nextCalender?.value,
        isRunningCalendar: false, // item?.runningCalender
        intCalendarSetupId: item?.intCalendarSetupId || 0,
      }));

      const objRow = payload?.map((item) => ({
        ...item,
        intCalendarSetupId: item?.intCalendarSetupId || 0,
      }));
      // part id hard coded 1
      if (id) {
        const payload = {
          objHeader: {
            intRosterGroupId: initDataForEdit?.rosterGroupId,
            strRosterGroupName: values?.rosterGroupName,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            actionBy: profileData?.userId,
          },
          objRow: objRow,
        };
        editRoster_api(payload, setDisabled);
      } else {
        saveRoster(
          1,
          profileData?.userId,
          payload,
          cb,
          setDisabled,
          "create",
          values?.rosterGroupName,
          profileData?.accountId,
          selectedBusinessUnit?.value
        );
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm title="Create Roster" getProps={setObjprops} isDisabled={isDisabled}>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? initDataForEdit : initData}
        saveHandler={saveHandler}
        calenderList={calenderList}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        setter={setter}
        employeeList={employeeList}
      />
    </IForm>
  );
}
