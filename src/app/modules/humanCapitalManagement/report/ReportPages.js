import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import DailyAttendanceLanding from "./dailyAttendance/Landing";
import { EmployeePayrollTable } from "./employeePayrollReport/Table/tableHeader";
import LeaveMovementHistory from "./leaveMovementHistory";
import LoanRescheduleReportLanding from "./loanScheduleReport";
import { EmployeePayrollDetailsTable } from "./employeePayrollDetails/Table/tableHeader";
import { EmployeeSalaryAdvice } from "./employeeSalaryAdvice/Table/tableHeader";
import AttendanceReport from "./attendanceReport";
import AttendanceDetailsLanding from "./attendanceDetails";
import RoasterReport from "./roasterReport";
import { EmpOverallStatus } from "./empOverallStatus/Form/AddEditForm";
import RoasterDetailsReport from "./rosterDetailsReport";
import AttendanceByRosterReport from "./attendanceByRoster";
import { SalaryTopSheetReport } from "./salaryTopSheet/Form/AddEditForm";
import DetailsTable from "./salaryTopSheet/DetailsTable";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { EmployeeExpenseForm } from "./employeeExpense/form/addEditForm";
import BonusReport from "./bonusReport";
import EmployeeDetailsInfo from "./employeeDetailsInfo/table/table";
import ExpenceReport from "./expenceReport/index";
import { EmpDirectory } from "./empDirectory/Form/AddEditForm";
import { SalaryDetailsReport } from "./salaryDetailsReport/Form/AddEditForm";
import ProfileOverview from "./profileOverview";
import { ProfileOverviewTable } from "./profileOverview/Table/profileOverviewTable";
import EmpServiceInfo from "./empServiceInfo";
import EmpConfirmationReport from "./empConfirmationReport";
import EmpPendingConfirmationReport from "./empPendingConfirmation";
import EmpJoiningReport from "./joiningReport";
import { EarnLeaveReport } from "./earnLeaveReport/Form/addEditForm";
import { TurnOverReport } from "./earnLeaveReport/turnOverReport/Form/addEditForm";
import FinalSettlement from "./finalSettlement";
import FamilyInfoReport from "./familyInfoReport";
import DateWiseAttendanceReport from "./dateWiseAttendanceReport";

export function ReportPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const empOverAllStatus = userRole.filter(
    (item) => item?.strFeatureName === "Employee Overall Status"
  );

  let empDirectoryPermission = null;
  let salaryDetailsPermission = null;
  let empOverview = null;
  let empServiceReport = null;
  let empJoiningReport = null;
  let empConfirmationReport = null;
  let earnLeaveReport = null;
  let turnOverReport = null;
  let empPendingConfirmationReport = null;
  let familyInfoReport = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 912) {
      empDirectoryPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1033) {
      earnLeaveReport = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1043) {
      turnOverReport = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 913) {
      salaryDetailsPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 918) {
      empServiceReport = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 950) {
      empOverview = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 982) {
      empJoiningReport = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 983) {
      empConfirmationReport = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 984) {
      empPendingConfirmationReport = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1251) {
      familyInfoReport = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/report"
      />

      {/* Daily Attendence */}
      <ContentRoute
        path="/human-capital-management/report/dailyattendance"
        component={DailyAttendanceLanding}
      />
      {/* Leave Movement History */}
      <ContentRoute
        path="/human-capital-management/report/leavemovementhistory"
        component={LeaveMovementHistory}
      />
      <ContentRoute
        path="/human-capital-management/report/loanschedulereport"
        component={LoanRescheduleReportLanding}
      />

      {/* Employy Payroll Report */}
      <ContentRoute
        path="/human-capital-management/Report/empPayrollReport"
        component={EmployeePayrollTable}
      />

      {/* Employee Payroll Details */}
      <ContentRoute
        path="/human-capital-management/Report/empPayrollDetails"
        component={EmployeePayrollDetailsTable}
      />

      {/* Employee Salary Advice */}
      <ContentRoute
        path="/human-capital-management/Report/empSalaryAdvice"
        component={EmployeeSalaryAdvice}
      />

      {/* Attendance Report */}
      <ContentRoute
        path="/human-capital-management/Report/AttendanceReport"
        component={AttendanceReport}
      />

      {/* Attendance Details */}
      <ContentRoute
        from="/human-capital-management/Report/AttendanceDetails"
        component={AttendanceDetailsLanding}
      />

      {/* Roaster Report */}
      <ContentRoute
        from="/human-capital-management/Report/roster-report"
        component={RoasterReport}
      />

      {/* Roaster Details Report */}
      <ContentRoute
        from="/human-capital-management/Report/details-roster-report"
        component={RoasterDetailsReport}
      />

      <ContentRoute
        from="/human-capital-management/Report/Attendance-by-roster"
        component={AttendanceByRosterReport}
      />

      {/* Employee Overall Status */}
      <ContentRoute
        from="/human-capital-management/Report/employee-overall-status"
        component={
          empOverAllStatus[0]?.isView ? EmpOverallStatus : NotPermittedPage
        }
      />

      <ContentRoute
        from="/human-capital-management/Report/employee-directory"
        component={
          empDirectoryPermission?.isView ? EmpDirectory : NotPermittedPage
        }
      />

      <ContentRoute
        from="/human-capital-management/Report/earnLeaveReport"
        component={earnLeaveReport?.isView ? EarnLeaveReport : NotPermittedPage}
      />

      <ContentRoute
        from="/human-capital-management/Report/employeeTurnoverReport"
        component={turnOverReport?.isView ? TurnOverReport : NotPermittedPage}
      />
      <ContentRoute
        from="/human-capital-management/Report/finalSettlement"
        component={FinalSettlement}
      />
      <ContentRoute
        from="/human-capital-management/Report/familyInfoReport"
        component={familyInfoReport?.isView ? FamilyInfoReport : NotPermittedPage}
      />

      <ContentRoute
        from="/human-capital-management/Report/DateWiseAttendanceReport"
        component={true ? DateWiseAttendanceReport : NotPermittedPage}
      />

      <ContentRoute
        path="/human-capital-management/Report/salary-details-report"
        component={
          salaryDetailsPermission?.isView
            ? SalaryDetailsReport
            : NotPermittedPage
        }
      />

      {/* Salary top sheet */}
      <ContentRoute
        path="/human-capital-management/Report/salary-top-sheet/details"
        component={DetailsTable}
      />
      <ContentRoute
        path="/human-capital-management/Report/salary-top-sheet"
        component={SalaryTopSheetReport}
      />
      {/* Employee Expenses */}
      <ContentRoute
        path="/human-capital-management/Report/employee-expense"
        component={EmployeeExpenseForm}
      />
      <ContentRoute
        path="/human-capital-management/Report/employee-details-info"
        component={EmployeeDetailsInfo}
      />

      <ContentRoute
        path="/human-capital-management/Report/bonusreport"
        component={BonusReport}
      />
      {/*  Expense Report*/}
      <ContentRoute
        path="/human-capital-management/Report/expenseReport"
        component={ExpenceReport}
      />
      <ContentRoute
        path="/human-capital-management/Report/profileOverview/view/:profileOverId/:title"
        component={ProfileOverviewTable}
      />
      <ContentRoute
        path="/human-capital-management/Report/profileOverview"
        component={empOverview?.isView ? ProfileOverview : NotPermittedPage}
      />
      {/* employeeServiceInfo */}
      <ContentRoute
        path="/human-capital-management/Report/employeeServiceInfo"
        component={empServiceReport?.isView ? EmpServiceInfo : NotPermittedPage}
      />
      {/* EmpConfirmationReport */}
      <ContentRoute
        path="/human-capital-management/Report/confirmationReport"
        component={empConfirmationReport?.isView ? EmpConfirmationReport : NotPermittedPage}
      />
      {/* EmpPendingConfirmationReport */}
      <ContentRoute
        path="/human-capital-management/Report/pendingConfirmation"
        component={empPendingConfirmationReport?.isView ? EmpPendingConfirmationReport : NotPermittedPage}
      />
      {/* EmpJoiningReport */}
      <ContentRoute
        path="/human-capital-management/Report/joiningReport"
        component={empJoiningReport?.isView ? EmpJoiningReport : NotPermittedPage}
      />
    </Switch>
  );
}
