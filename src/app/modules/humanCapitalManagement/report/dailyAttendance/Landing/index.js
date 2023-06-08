/* eslint-disable react-hooks/exhaustive-deps */
import {
  ModalProgressBar,
  Card,
} from "../../../../../../_metronic/_partials/controls";
import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import "./style.css";
import moment from "moment";
import CalendarFooter from "./CalendarFooter";

function DailyAttendanceLanding() {
  const [value, setValue] = useState(moment());
  const [allDayList, setAllDayList] = useState([]);

  // Generate 1 month all day's
  useEffect(() => {
    const endDay = Number(
      moment(value)
        .endOf("month")
        .format("D")
    );
    let finalDayList = [...(Array(endDay) + 1)]?.map((item, index) => {
      if (index + 1 < 10) {
        return `0${index + 1}`;
      } else {
        return `${index + 1}`;
      }
    });
    setAllDayList(finalDayList);
  }, [value]);

  useEffect(() => {
    setValue(moment(value));
  }, []);

  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <div className="container-fluid dynamic-calender-css mainBody">
          <CalendarHeader
            allDayList={allDayList}
            setAllDayList={setAllDayList}
            value={value}
            setValue={setValue}
          />
        </div>
        <CalendarFooter />
      </Card>
    </>
  );
}

export default DailyAttendanceLanding;
