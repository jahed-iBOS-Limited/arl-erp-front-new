import React, { Suspense } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../../../_metronic/layout';
import { OverTimeManagementPages } from './overTimeManagement/overTimeManagementPages';

export function HumanCapitalManagementPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <div className="hcm-module">
        <Switch>
          <Redirect
            exact={true}
            from="/human-capital-management"
            to="/human-capital-management/overtime-management"
          />
          {/* <ContentRoute
            path="/human-capital-management/humanResource"
            component={HumanResourcePages}
          />
          <ContentRoute
            path="/human-capital-management/hcmconfig"
            component={ConfigurationPages}
          />
          <ContentRoute
            path="/human-capital-management/loan"
            component={LoanPages}
          />
          <ContentRoute
            path="/human-capital-management/report"
            component={ReportPages}
          />
          <ContentRoute
            path="/human-capital-management/leavemovement"
            component={LeaveMovementPages}
          />

          <ContentRoute
            path="/human-capital-management/cafeteriamgt"
            component={CafeteriaManagementPages}
          />

          <ContentRoute
            path="/human-capital-management/calendar"
            component={WorkingCalenderPages}
          />
          <ContentRoute
            path="/human-capital-management/attendancemgt"
            component={EmployeeAttendancePages}
          />
          <ContentRoute
            path="/human-capital-management/additionanddeduction"
            component={AdditionDeductionPages}
          />

          <ContentRoute
            path="/human-capital-management/payrollmanagement"
            component={PayrollManagementPages}
          />

          <ContentRoute
            path="/human-capital-management/jobcircular"
            component={JobCircularPages}
          /> */}
          <ContentRoute
            path="/human-capital-management/overtime-management"
            component={OverTimeManagementPages}
          />
        </Switch>
      </div>
    </Suspense>
  );
}

export default HumanCapitalManagementPages;
