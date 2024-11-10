import React from "react";
import { Route } from "react-router-dom";
import { AttendanceDetailsTable } from "./Table/tableHeader";
import ViewForm from "./View/viewModal";
import "./style.css";
function AttendanceDetailsLanding() {
  return (
    <>
      <Route path="/human-capital-management/attendancemgt/attendanceDetails/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push(
                "/human-capital-management/attendancemgt/attendanceDetails"
              );
            }}
          />
        )}
      </Route>
      <AttendanceDetailsTable />
    </>
  );
}

export default AttendanceDetailsLanding;
