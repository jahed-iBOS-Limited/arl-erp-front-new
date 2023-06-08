import React from "react";
import { shallowEqual, useSelector } from "react-redux";

import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { Department } from "./Department";
import { Designation } from "./designation";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { DepartmentAddForm } from "./Department/Form/addEditForm";
import { DesignationAddForm } from "./designation/Form/addEditForm";
import ElmployeeInformationForm from "./employeeInformation/Form/addEditForm";
import { OfficialInformation } from "./officialInformation";
import OfficialInfoCollapsePanel from "./officialInformation/EditForm/mainCollapse";
import { PersonalInformationLanding } from "./personalInformation";
import PersonalInfoCollapsePanel from "./personalInformation/EditForm/mainCollapse";
// import OtherInformationCollapsePanel from "./OtherInformation/EditForm/mainCollapse";
import OtherInfolLanding from "./OtherInformation/Table";
import OtherInformationCollapsePanel from "./OtherInformation/EditForm/mainCollapse";
import { EmployeeReRegistration } from "./re-registration";
import PromotionIncrement from "./promotionIncrement/Landing/Landing";
import findIndex from "../../_helper/_findIndex";
import BasicInformationlLanding from "./employeeInformation/Table/form";
import BankInformationUpdate from "./bankInfoUpdate/addEditForm";
import Create from "./empCreateAndUpdate/Create";
import Update from "./empCreateAndUpdate/Update";

export function HumanResourcePages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const basicInfo = userRole[findIndex(userRole, "Basic Information")];
  const personalInfo = userRole[findIndex(userRole, "Personal Information")];
  const officeInfo = userRole[findIndex(userRole, "Official Information")];

  let empCreate = null;
  let empUpdate = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 905) {
      empCreate = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 906) {
      empUpdate = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management/humanResource"
        to="/human-capital-management/humanresource/employeebasic-info"
      />

      <ContentRoute
        path="/human-capital-management/humanresource/department/add"
        component={DepartmentAddForm}
      />
      <ContentRoute
        path="/human-capital-management/humanresource/designation/add"
        component={DesignationAddForm}
      />
      <ContentRoute
        path="/human-capital-management/humanresource/designation/edit/:id"
        component={DesignationAddForm}
      />

      <ContentRoute
        exact={true}
        path="/human-capital-management/humanresource/department/edit/:id"
        component={DepartmentAddForm}
      />
      <ContentRoute
        path="/human-capital-management/humanResource/department"
        component={Department}
      />
      <ContentRoute
        path="/human-capital-management/humanResource/designation"
        component={Designation}
      />

      {/* employee-info routes */}
      <ContentRoute
        path="/human-capital-management/humanresource/employee-info/add"
        component={
          basicInfo?.isCreate ? ElmployeeInformationForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/humanresource/employeecreate"
        component={empCreate?.isCreate ? Create : NotPermittedPage}
      />
      <ContentRoute
        path="/human-capital-management/humanresource/employeeupdate"
        component={empUpdate?.isCreate ? Update : NotPermittedPage}
      />
      <ContentRoute
        path="/human-capital-management/humanresource/employee-info"
        component={BasicInformationlLanding}
      />

      {/* OfficialInformation route */}
      <ContentRoute
        path="/human-capital-management/humanresource/official-info/edit/:id"
        component={
          officeInfo?.isEdit ? OfficialInfoCollapsePanel : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/humanresource/official-info"
        component={OfficialInformation}
      />
      {/* Personal Information */}
      <ContentRoute
        path="/human-capital-management/humanresource/personal-info/edit/:id"
        component={
          personalInfo?.isEdit ? PersonalInfoCollapsePanel : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/humanresource/personal-info"
        component={PersonalInformationLanding}
      />
      {/* Other Information route*/}
      <ContentRoute
        path="/human-capital-management/humanresource/other-info/edit/:id"
        component={OtherInformationCollapsePanel}
      />
      <ContentRoute
        path="/human-capital-management/humanresource/other-info"
        component={OtherInfolLanding}
      />

      {/* Re-Registration route*/}
      {/* <ContentRoute
        path="/human-capital-management/humanresource/other-info/edit/:id"
        component={OtherInformationCollapsePanel}
      /> */}
      <ContentRoute
        path="/human-capital-management/humanresource/re-reg"
        component={EmployeeReRegistration}
      />

      {/* Promotion and increment */}
      <ContentRoute
        path="/human-capital-management/humanresource/promotion-increment"
        component={PromotionIncrement}
      />

      {/* Bank Info update */}
      <ContentRoute
        path="/human-capital-management/humanresource/update-emp-bank-info"
        component={BankInformationUpdate}
      />
    </Switch>
  );
}
