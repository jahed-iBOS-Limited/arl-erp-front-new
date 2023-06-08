import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import EmployeeAttendenceForm from "./employeeAttendence/Form/addEditForm";
import UpdateEmployeeAttendenceForm from "./updateEmpAttendance/Form/addEditForm";
import RemoteAttendance from "./remoteAttendance/index";
import CustomerLocationSetup from "./customerLocationSetup/Table/index";
import CustomerLocaitonAttendanceingForm from "./customerLocationSetup/Form/addEditForm";
import { ObeyRadiousForBUTable } from "./obeyRadiousForBu/Table/tableHeader";
import ObeyRadiousCreateForm from "./obeyRadiousForBu/Form/addEditForm";
// import AttendanceDetailsLanding from "./attendanceDetails";
import AttendanceRegisterApproveLanding from "./attendanceRegisterApproval/Landing/Landing";

export function EmployeeAttendancePages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/attendancemgt"
      />

      {/* Employee Attendance */}
      <ContentRoute
        from="/human-capital-management/attendancemgt/employeeAttendance"
        component={EmployeeAttendenceForm}
      />
      {/* Update Employee Attendance */}
      <ContentRoute
        from="/human-capital-management/attendancemgt/updateEmployeeAttendance"
        component={UpdateEmployeeAttendenceForm}
      />
      {/* Attendance Details */}
      {/* <ContentRoute
        from="/human-capital-management/attendancemgt/attendanceDetails"
        component={AttendanceDetailsLanding}
      /> */}
      {/* RemoteAttendance */}

      <ContentRoute
        from="/human-capital-management/attendancemgt/remoteattendance"
        component={RemoteAttendance}
      />

      <ContentRoute
        from="/human-capital-management/attendancemgt/customerlocationsetup/customerlocation"
        component={CustomerLocaitonAttendanceingForm}
      />
      <ContentRoute
        from="/human-capital-management/attendancemgt/customerlocationsetup"
        component={CustomerLocationSetup}
      />
      {/* Obey Radious for BU */}
      <ContentRoute
        from="/human-capital-management/attendancemgt/obeyRadiusForBusinessUnit/create"
        component={ObeyRadiousCreateForm}
      />
      <ContentRoute
        from="/human-capital-management/attendancemgt/obeyRadiusForBusinessUnit/edit/:id"
        component={ObeyRadiousCreateForm}
      />
      <ContentRoute
        from="/human-capital-management/attendancemgt/obeyRadiusForBusinessUnit"
        component={ObeyRadiousForBUTable}
      />

      {/* Attendance Register Approval */}
      <ContentRoute
        from="/human-capital-management/attendancemgt/attendanceRegisterApproval"
        component={AttendanceRegisterApproveLanding}
      />
    </Switch>
  );
}
