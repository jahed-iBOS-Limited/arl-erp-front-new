import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { EmpDepartmentForm } from "./EmpDepartment/Form/AddEditForm";
import EmpDepartmentLanding from "./EmpDepartment/Landing/Landing";
import { Workplace } from "./workPlace";
import WorkplaceForm from "./workPlace/Form/AddEditForm";

import WorkplaceGroupForm from "./workplaceGroup/Form/AddEditForm";
import WorkplaceGroup from "./workplaceGroup/index";

import EmpFuncDesgLanding from "./empFuncDesignation/Landing";
import { EmpFuncDesgForm } from "./empFuncDesignation/Form/addEditForm";

import EmpGradeLanding from "./employeeGrade/Landing";
import { EmpGradeForm } from "./employeeGrade/Form/addEditForm";
import EmployeeGradeView from "./employeeGrade/view";

import EmpPositionGroupLanding from "./empPositionGroup/Landing";
import { EmpPositionGroupForm } from "./empPositionGroup/Form/addEditForm";

import EmploymentTypeLanding from "./employmentType/Landing";
import { EmploymentTypeForm } from "./employmentType/Form/addEditForm";

import EmpHRLanding from "./empHRPosition/Landing/Landing";
import HRRumenarationTypeLanding from "./rumenarationtype/Landing/Landing";
import { HRRumenarationTypeForm } from "./rumenarationtype/Form/addEditForm";
import HRRumenarationComponentTypeLanding from "./rumenarationcomponenttype/Landing/Landing";
import { HRRumenarationComponentTypeForm } from "./rumenarationcomponenttype/Form/addEditForm";
import HRRumenarationComponentLanding from "./rumenarationcomponent/Landing/Landing";
import { RumenarationComponentForm } from "./rumenarationcomponent/Form/addEditForm";

import { HRPositionForm } from "./empHRPosition/Form/addEditForm";

import OrganizationComponentLanding from "./organization/Landing/Landing";
import { OrganizationComponentForm } from "./organization/Form/addEditForm";
import EmpPositionGroupView from "./empPositionGroup/view";

import PayrollPeriodLanding from "./PayrollPeriod/Landing/Landing";
import { PayrollPeriodForm } from "./PayrollPeriod/Form/AddEditForm";
import PayrollGroupLanding from "./PayrollGroup/Landing/Landing";
import { PayrollGroupForm } from "./PayrollGroup/Form/AddEditForm";

import { ProfileSetupLanding } from "./profileSetup/profileSetupMain";
import ProfileSetupForm from "./profileSetup/profileSetupMain/Form/addEditForm";
import ProfileSectionLanding from "./profileSection";
import ProfileSectionCreateForm from "./profileSection/Form/addEditForm";
import ProfileSectionViewForm from "./profileSection/viewForm/addEditForm";

import EmpGroupCreateForm from "./empGroup/Form/addEditForm";
// import { EmpGroupTable } from "./empGroup/Table/tableHeader";
import { EmpGroupModal } from "./empGroup";
import EmpGroupExtendCreateForm from "./empGroup/extendEmpGroup/addEditForm";
// import { DocumentTypeLanding } from "./documentType";
import CreateDocumentTypeForm from "./documentType/Create/addForm";
import DocumentTypeLanding from "./documentType/index";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";
import BonusNameLanding from "./bonusName/Landing/index";
import { BonusNameForm } from "./bonusName/Form/addEditForm";
import BonusSetupLanding from "./bonusSetup/Landing/index";
import { BonusSetupForm } from "./bonusSetup/Form/addEditForm";

export function ConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const departmentPermission = userRole[findIndex(userRole, "Department")];
  const hrPositionGroupPermission =
    userRole[findIndex(userRole, "HR Position Group")];
  const hrPositionPermission = userRole[findIndex(userRole, "HR Position")];
  const employeeGradePermission =
    userRole[findIndex(userRole, "Employee Grade")];
  const designationPermission = userRole[findIndex(userRole, "Designation")];
  const workPlacePermission = userRole[findIndex(userRole, "Workplace Group")];
  const workPermission = userRole[findIndex(userRole, "Workplace")];
  const employeeTypePermission =
    userRole[findIndex(userRole, "Employment Type")];
  const payrollGrPermission = userRole[findIndex(userRole, "Payroll Group")];
  const payrollPeriodPermission =
    userRole[findIndex(userRole, "Payroll Period")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/hcmconfig"
      />

      {/* Emp functional Work Place */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/workplace/create"
        component={workPermission?.isCreate ? WorkplaceForm : NotPermittedPage}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/workplace/edit/:id"
        component={workPermission?.isEdit ? WorkplaceForm : NotPermittedPage}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/workplace"
        component={Workplace}
      />

      {/* Working Group Routing */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/workplcgroup/create"
        component={
          workPlacePermission?.isCreate ? WorkplaceGroupForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/workplcgroup/edit/:id"
        component={
          workPlacePermission?.isEdit ? WorkplaceGroupForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/workplcgroup"
        component={WorkplaceGroup}
      />

      {/* Emp department */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/empdepartment/create"
        component={
          departmentPermission?.isCreate ? EmpDepartmentForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/empdepartment/edit/:id"
        component={
          departmentPermission?.isEdit ? EmpDepartmentForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/empdepartment"
        component={EmpDepartmentLanding}
      />

      {/* Emp HR Position */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/emphrposition/create"
        component={
          hrPositionPermission?.isCreate ? HRPositionForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/emphrposition/edit/:id"
        component={
          hrPositionPermission?.isEdit ? HRPositionForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/human-capital-management/hcmconfig/emphrposition"
        component={EmpHRLanding}
      />

      {/* Employee functional designation */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/empfundesignation/edit/:id"
        component={
          designationPermission?.isEdit ? EmpFuncDesgForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/empfundesignation/create"
        component={
          designationPermission?.isCreate ? EmpFuncDesgForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/empfundesignation"
        component={EmpFuncDesgLanding}
      />

      {/* Employee Grade */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/empgrade/edit/:empGradeId/:posId/:posGrpId"
        component={
          employeeGradePermission?.isEdit ? EmpGradeForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/empgrade/view/:empGradeId/:posId/:posGrpId"
        component={
          employeeGradePermission?.isView ? EmployeeGradeView : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/empgrade/create"
        component={
          employeeGradePermission?.isCreate ? EmpGradeForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/empgrade"
        component={EmpGradeLanding}
      />

      {/* Employee Grade two */}

      {/* <ContentRoute
        path="/human-capital-management/hcmconfig/empgrade/create"
        component={EmpGradeTwoForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/empgrade"
        component={EmpGradeTableTwo}
      /> */}

      {/* Employment Type */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/employmenttype/edit/:id"
        component={
          employeeTypePermission?.isEdit ? EmploymentTypeForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/employmenttype/create"
        component={
          employeeTypePermission?.isCreate
            ? EmploymentTypeForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/employmenttype"
        component={EmploymentTypeLanding}
      />

      {/* Employee Position Group */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/emppositiongroup/view/:id"
        component={
          hrPositionGroupPermission?.isView
            ? EmpPositionGroupView
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/emppositiongroup/edit/:id"
        component={
          hrPositionGroupPermission?.isEdit
            ? EmpPositionGroupForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/emppositiongroup/create"
        component={
          hrPositionGroupPermission?.isCreate
            ? EmpPositionGroupForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/emppositiongroup"
        component={EmpPositionGroupLanding}
      />

      {/* HR rumenaration type */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationtype/create"
        component={HRRumenarationTypeForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationtype/edit/:id"
        component={HRRumenarationTypeForm}
      />

      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationtype"
        component={HRRumenarationTypeLanding}
      />
      {/* HR rumenaration component type */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationcmptype/create"
        component={HRRumenarationComponentTypeForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationcmptype/edit/:id"
        component={HRRumenarationComponentTypeForm}
      />

      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationcmptype"
        component={HRRumenarationComponentTypeLanding}
      />

      {/* HR rumenaration component */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationcomponent/create"
        component={RumenarationComponentForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationcomponent/edit/:id"
        component={RumenarationComponentForm}
      />

      <ContentRoute
        path="/human-capital-management/hcmconfig/hrrumenarationcomponent"
        component={HRRumenarationComponentLanding}
      />

      {/* Organization Component*/}
      <ContentRoute
        path="/human-capital-management/hcmconfig/organizationcomponent/create"
        component={OrganizationComponentForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/organizationcomponent/edit/:id"
        component={OrganizationComponentForm}
      />

      <ContentRoute
        path="/human-capital-management/hcmconfig/organizationcomponent"
        component={OrganizationComponentLanding}
      />

      {/* Payroll Period */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/payrollPeriod/create"
        component={
          payrollPeriodPermission?.isCreate
            ? PayrollPeriodForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/payrollPeriod/edit/:id"
        component={
          payrollPeriodPermission?.isEdit ? PayrollPeriodForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/payrollPeriod"
        component={PayrollPeriodLanding}
      />
      {/* Profile Section route */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/profile-section/view/:id"
        component={ProfileSectionViewForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/profile-section/edit/:id"
        component={ProfileSectionCreateForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/profile-section/add"
        component={ProfileSectionCreateForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/profile-section"
        component={ProfileSectionLanding}
      />

      {/* Profile Setup route */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/profile-setup/edit/:id"
        component={ProfileSetupForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/profile-setup/add"
        component={ProfileSetupForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/profile-setup"
        component={ProfileSetupLanding}
      />
      {/* Payroll Group */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/payrollGroup/create"
        component={
          payrollGrPermission?.isCreate ? PayrollGroupForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/payrollGroup/edit/:id"
        component={
          payrollGrPermission?.isEdit ? PayrollGroupForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/payrollGroup"
        component={PayrollGroupLanding}
      />

      {/* Emp Group  */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/emp-group/create"
        component={EmpGroupCreateForm}
      />
      {/* EmpGroupExtendCreateForm */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/emp-group/extendEmpGroup"
        component={EmpGroupExtendCreateForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/emp-group"
        component={EmpGroupModal}
      />

      {/* Document Type */}

      <ContentRoute
        path="/human-capital-management/hcmconfig/documenttype/edit/:id"
        component={CreateDocumentTypeForm}
      />

      <ContentRoute
        path="/human-capital-management/hcmconfig/documenttype/create"
        component={CreateDocumentTypeForm}
      />

      <ContentRoute
        path="/human-capital-management/hcmconfig/documenttype"
        component={DocumentTypeLanding}
      />

      {/* Bonus Name */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/createbonusname/edit/:id"
        component={BonusNameForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/createbonusname/create"
        component={BonusNameForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/createbonusname"
        component={BonusNameLanding}
      />

      {/* Bonus Setup */}
      <ContentRoute
        path="/human-capital-management/hcmconfig/bonussetup/edit/:id"
        component={BonusSetupForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/bonussetup/create"
        component={BonusSetupForm}
      />
      <ContentRoute
        path="/human-capital-management/hcmconfig/bonussetup"
        component={BonusSetupLanding}
      />
    </Switch>
  );
}
