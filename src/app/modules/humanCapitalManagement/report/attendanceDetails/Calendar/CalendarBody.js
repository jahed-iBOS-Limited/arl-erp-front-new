/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, Fragment } from "react";
import moment from "moment";
import { colorList } from "./helper";

function CalendarBody({ value, attendanceListDate }) {
  // eslint-disable-next-line no-unused-vars
  const [allDayList, setAllDayList] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const checkStatusAndChangeColor = (date, index) => {
    if (attendanceListDate[index]?.presentStatus.toLowerCase() === "present") {
      return (
        <div
          style={colorList.preset.backgroundColor}
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status">
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "off day"
    ) {
      return (
        <div
          style={colorList.offday.backgroundColor}
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status">
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "leave"
    ) {
      return (
        <div
          style={colorList.leave.backgroundColor}
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status">
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "holiday"
    ) {
      return (
        <div
          style={colorList.holiday.backgroundColor}
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status">
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "late"
    ) {
      return (
        <div
          style={colorList.late.backgroundColor}
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status">
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else if (
      attendanceListDate[index]?.presentStatus.toLowerCase() === "unprocessed"
    ) {
      return (
        <div
          style={colorList.unprocessed.backgroundColor}
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status">
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    } else {
      return (
        <div
          style={colorList.default.backgroundColor}
          className="singleCalendarDay"
        >
          <span className="day">{date}</span>
          <span className="status">
            {attendanceListDate[index]?.presentStatus}
          </span>
        </div>
      );
    }
  };

  useEffect(() => {
    const endDay = Number(
      moment(value)
        .endOf("month")
        .format("D")
    );
    let AllDaysInMonth = [];
    for (let i = 1; i <= endDay; i++) {
      if (i < 10) {
        AllDaysInMonth.push(`0${i}`);
      } else {
        AllDaysInMonth.push(`${i}`);
      }
    }
    setAllDayList(AllDaysInMonth);
  }, [value]);

  return (
    <>
      <div className="allCalendarDays">
        {/* First Week Blank Days start */}
        {/* {[
          ...Array(
            Number(
              moment(value)
                .startOf("month")
                .format("day")[0]
            )
          ),
        ].map((item, index) => {
          return (
            <div
              key={index}
              style={colorList.default.backgroundColor}
              className="singleCalendarDay"
            >
              <span className="day">-</span>
            </div>
          );
        })} */}
        {/* First Week Blank Days End */}

        {/* All Days of a month */}
        {/* {allDayList.length > 0 &&
          allDayList.map((item, i) => {
            return (
              <Fragment key={i}>{checkStatusAndChangeColor(item, i)}</Fragment>
            );
          })} */}
        {/* All Days of a month End */}

        {/* Last Week Blank Days start */}
        {/* {[
          ...Array(
            Number(
              6 -
                moment(value)
                  .endOf("month")
                  .format("day")[0]
            )
          ),
        ].map((item, index) => {
          return (
            <div
              key={index}
              style={colorList.default.backgroundColor}
              className="singleCalendarDay"
            >
              <span className="day">-</span>
            </div>
          );
        })} */}
        {/* Last Week Blank Days End */}
      </div>
    </>
  );
}

export default CalendarBody;
