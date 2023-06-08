/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import CalendarBody from "./CalendarBody";
import { getEmployeeAttendenceDetailsReport } from "./helper";

// eslint-disable-next-line no-unused-vars
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function CalendarHeader({ value, setValue, employeeId }) {
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

  const endDay = Number(
    moment(value)
      .endOf("month")
      .format("D")
  );

  useEffect(() => {
    getEmployeeAttendenceDetailsReport(
      employeeId,
      endDay,
      currMonth(),
      currYear(),
      setAttendanceListDate
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // This dependancy must need for change the date and fetch next or prev month data

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
              &nbsp; Last Month
            </span>
            |
            <div className="monthDate">
              <span className="month"> {currMonthName()}</span>
              <span className="year">{currYear()}</span>
            </div>
            |
            <span
              onClick={() => {
                setValue(nextMonth());
              }}
            >
              Next Month &nbsp;
              <i className="icon fas fa-forward"></i>
            </span>
          </div>
        </div>
        {/* <div className="allDays">
          {weekdays.map((item, index) => {
            return (
              <h5 key={index} className="day">
                {item}
              </h5>
            );
          })}
        </div> */}
      </header>
      <CalendarBody value={value} attendanceListDate={attendanceListDate} />
    </>
  );
}

export default CalendarHeader;
