/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CalendarBody from "./CalendarBody";
import { getEmployeeAttendenceDetailsReport } from "./helper";
import { useSelector, shallowEqual } from "react-redux";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function CalendarHeader({ value, setValue, allDayList }) {
  const [attendanceListDate, setAttendanceListDate] = useState([]);

  function currMonthName() {
    return value.format("MMMM");
  }

  function currMonth() {
    return value.format("MM");
  }

  function currYear() {
    return value.format("YYYY");
  }

  function prevMonth() {
    return value.clone().subtract(1, "month");
  }

  function nextMonth() {
    return value.clone().add(1, "month");
  }

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (allDayList?.length > 0) {
      getEmployeeAttendenceDetailsReport(
        profileData.userReferenceId,
        currMonth(),
        currYear(),
        setAttendanceListDate,
        allDayList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDayList]); // This dependancy must need for change the date and fetch next or prev month day's data

  return (
    <>
      <header>
        <div>
          <div className="currentMonthYear">
            <span
              onClick={() => {
                setValue(prevMonth());
              }}
            >
              <i className="icon fas fa-backward"></i>
            </span>

            <div className="monthDate">
              <span className="month">{currMonthName()}</span>
              <span className="year">{currYear()}</span>
            </div>

            <span
              onClick={() => {
                setValue(nextMonth());
              }}
            >
              <i className="icon fas fa-forward"></i>
            </span>
          </div>
        </div>
        <div className="allDays">
          {weekdays?.map((item, index) => {
            return (
              <h5 key={index} className="day">
                {item}
              </h5>
            );
          })}
        </div>
      </header>
      <CalendarBody
        allDayList={allDayList}
        value={value}
        attendanceListDate={attendanceListDate}
      />
    </>
  );
}

export default CalendarHeader;
