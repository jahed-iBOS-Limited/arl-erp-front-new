import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { Suspense } from "react";
import RosterLanding from "./roster/Table/Landing";
import RosterForm from "./roster/Form/addEditForm";
import HolidaySetupForm from "./holidaySetup/Form/addEditForm";
import { HolidaySetupLanding } from "./holidaySetup/Table/tableHeader";
import HolidaySetupViewForm from "./holidaySetup/view/addEditForm";
import { WorkScheduleReport } from "./workSchedule/Form/AddEditForm";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";
import CreateCalenderForm from "../configuration/calenderSetUp/Create/addForm";
import CreateCalenderViewForm from "../configuration/calenderSetUp/view/addForm";
import CalenderSetUpLanding from "../configuration/calenderSetUp";

export function WorkingCalenderPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const CalanderPermission = userRole[findIndex(userRole, "Calander Setup")];
  const roasterPermission = userRole[findIndex(userRole, "Roster")];

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact
          from="/human-capital-management/calendar"
          to="/human-capital-management/calendar/roster"
        />
        {/* Roaster */}
        <ContentRoute
          exact
          path="/human-capital-management/calendar/roster/edit/:id"
          component={roasterPermission?.isEdit ? RosterForm : NotPermittedPage}
        />
        <ContentRoute
          exact
          path="/human-capital-management/calendar/roster/create"
          component={
            roasterPermission?.isCreate ? RosterForm : NotPermittedPage
          }
        />
        <ContentRoute
          exact
          path="/human-capital-management/calendar/roster"
          component={RosterLanding}
        />

        {/* Holiday SetUp */}
        <ContentRoute
          exact
          path="/human-capital-management/calendar/holiday-setup/view/:id"
          component={HolidaySetupViewForm}
        />
        <ContentRoute
          exact
          path="/human-capital-management/calendar/holiday-setup/edit/:id"
          component={HolidaySetupForm}
        />
        <ContentRoute
          exact
          path="/human-capital-management/calendar/holiday-setup/create"
          component={HolidaySetupForm}
        />
        <ContentRoute
          exact
          path="/human-capital-management/calendar/holiday-setup"
          component={HolidaySetupLanding}
        />

        {/* Work Schedule report  */}
        <ContentRoute
          exact
          path="/human-capital-management/calendar/work-schedule"
          component={WorkScheduleReport}
        />

        {/* Calander Setup */}

        <ContentRoute
          path="/human-capital-management/calendar/calandersetup/edit/:id"
          component={
            CalanderPermission?.isEdit ? CreateCalenderForm : NotPermittedPage
          }
        />

        <ContentRoute
          path="/human-capital-management/calendar/calandersetup/view/:id"
          component={
            CalanderPermission?.isView
              ? CreateCalenderViewForm
              : NotPermittedPage
          }
        />

        <ContentRoute
          path="/human-capital-management/calendar/calandersetup/create"
          component={
            CalanderPermission?.isCreate ? CreateCalenderForm : NotPermittedPage
          }
        />

        <ContentRoute
          path="/human-capital-management/calendar/calandersetup"
          component={CalenderSetUpLanding}
        />
      </Switch>
    </Suspense>
  );
}

export default WorkingCalenderPages;
