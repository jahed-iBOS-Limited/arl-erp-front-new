import {
  ModalProgressBar,
  Card,
} from "../../../../../../_metronic/_partials/controls";
import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import "./style.css";
import moment from "moment";
import CalendarFooter from './CalendarFooter';

function DailyAttendanceLanding() {
  const [value, setValue] = useState(moment());
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <div className="container-fluid dynamic-calender-css mainBody">
          <CalendarHeader value={value} setValue={setValue} />
        </div>
        <CalendarFooter />
      </Card>
    </>
  );
}

export default DailyAttendanceLanding;

