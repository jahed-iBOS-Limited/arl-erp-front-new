import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import LeaveApprovalLanding from "./LeaveApproval/Landing/Landing";
import { LeaveMovementApplication } from "./leaveMovementApplication";
import { LeaveMovementAddForm } from "./leaveMovementApplication/Form/addEditForm";
import MovementApprovalLanding from "./MovementApproval/Landing/Landing";
import YearlyLeavePolicyLanding from "./yearlyLeavePolicy";
import CreateYearlyLeavePolicyForm from "./yearlyLeavePolicy/Create/addForm";
import ViewYearlyLeavePolicyForm from "./yearlyLeavePolicy/view/addForm";
import { LeaveTypeLanding } from "./LeaveType/Table/tableHeader";
import LeaveTypeCreateForm from "./LeaveType/Form/addEditForm";
import { PLDateChange } from "./plDateChange/Table";
import { shallowEqual, useSelector } from "react-redux";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";

export function LeaveMovementPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let plDateChange = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 917) {
      plDateChange = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/leavemovement"
      />

      {/* leave/movement Application */}
      <ContentRoute
        path="/human-capital-management/leavemovement/leavemovemententry/add"
        component={LeaveMovementAddForm}
      />
      <ContentRoute
        path="/human-capital-management/leavemovement/leavemovemententry"
        component={LeaveMovementApplication}
      />
      <ContentRoute
        path="/human-capital-management/leavemovement/leaveapproval"
        component={LeaveApprovalLanding}
      />
      {/* Movement Approval landing */}
      <ContentRoute
        path="/human-capital-management/leavemovement/movementapproval"
        component={MovementApprovalLanding}
      />

      {/* leave type Create  */}
      <ContentRoute
        path="/human-capital-management/leavemovement/leaveType/create"
        component={LeaveTypeCreateForm}
      />
      <ContentRoute
        path="/human-capital-management/leavemovement/leaveType/edit/:id"
        component={LeaveTypeCreateForm}
      />
      {/* leave type landing  */}
      <ContentRoute
        path="/human-capital-management/leavemovement/leaveType"
        component={LeaveTypeLanding}
      />

      {/* Pl date change */}

      <ContentRoute
        path="/human-capital-management/leavemovement/pldatechange"
        component={plDateChange?.isCreate ? PLDateChange : NotPermitted }
      />

      {/* yearly leave policy */}

      <ContentRoute
        path="/human-capital-management/leavemovement/yearlyleavepolicy/edit/:id"
        component={CreateYearlyLeavePolicyForm}
      />
      <ContentRoute
        path="/human-capital-management/leavemovement/yearlyleavepolicy/view/:id"
        component={ViewYearlyLeavePolicyForm}
      />

      <ContentRoute
        path="/human-capital-management/leavemovement/yearlyleavepolicy/create"
        component={CreateYearlyLeavePolicyForm}
      />
      <ContentRoute
        path="/human-capital-management/leavemovement/yearlyleavepolicy"
        component={YearlyLeavePolicyLanding}
      />
    </Switch>
  );
}
