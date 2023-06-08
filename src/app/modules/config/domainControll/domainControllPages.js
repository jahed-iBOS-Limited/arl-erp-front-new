import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { BusinessUnit } from "./businessUnit";
import { CreateUser } from "./createUser/UserPage";
import { RoleExtension } from "./roleExtension";
import AddForm from "./businessUnit/businessUnitCreate/addForm";
import { RoleAddForm } from "./roleExtension/roleExtensionCreate/addForm";
import RoleEditForm from "./roleExtension/roleExtensionEdit/editForm";
import CreateUserHeader from "./createUser/createUser-create/createUserHeader";
import { ContentRoute } from "../../../../_metronic/layout";
import EditForm from "./businessUnit/businessUnitEdit/editForm";
import { UserGroup } from "./userGroup";
import UserGroupAddForm from "./userGroup/userGroupCreate/addForm";
import UserGroupEditForm from "./userGroup/userGroupEdit/editForm";
import { CodeGenerate } from "./code-generate";
import CodeGenerateForm from "./code-generate/Form/addEditForm";
import ApprovalLanding from "./approvalSetup/landing";
import ApprovalSetupCreate from "./approvalSetup/Form/addEditForm";
import UserGroupViewFrom from "./userGroup/userGroupView/editForm";
import FutureGroupForm from "./featureGroup/form/addEditForm";
import FutureGroupLanding from "./featureGroup/landing/table";
import RoleManagerForm from "./roleManager/form/addEditForm";
import RoleManager from "./roleManager/landing/table";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { PriceStructureGlLanding } from "./priceStructureGL/landing/Form/addEditForm";
import findIndex from "../../_helper/_findIndex";
import { AccountingConfigForm } from "./accountingConfig/form/addEditForm";
import AccountsControlLanding from "./accountsControl/landing";
import ReportRoleManagerCreateForm from "./reportRoleExtension/form/addEditForm";
import UserPassword from "./userPassword";
import ItemStockUpdate from "./itemStockUpdate";

export function DomainControllPages() {
  let { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let roleManager = userRole[findIndex(userRole, "User Role Manager")];

  let roleExtension = userRole[findIndex(userRole, "User Role Extension")];
  let businessUnitPermission = userRole[findIndex(userRole, "Business Unit")];
  let userPermission = userRole[findIndex(userRole, "User")];
  let userGroupPermission = userRole[findIndex(userRole, "User Group")];
  let codeGeneratePermission = userRole[findIndex(userRole, "Code Generate")];
  let approvalSetupPermission = userRole[findIndex(userRole, "Approval Setup")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/config/domain-controll"
        to="/config/domain-controll/business-unit"
      />
      <ContentRoute
        path="/config/domain-controll/business-unit/edit/:id"
        component={businessUnitPermission?.isEdit ? EditForm : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/role-extension/edit/:id"
        component={roleExtension?.isEdit ? RoleEditForm : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/role-extension/add"
        component={roleExtension?.isCreate ? RoleAddForm : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/create-user/new"
        component={
          userPermission?.isCreate ? CreateUserHeader : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/create-user/:id/:v/view"
        component={userPermission?.isView ? CreateUserHeader : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/create-user/:id/:e/edit"
        component={userPermission?.isEdit ? CreateUserHeader : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/business-unit/add"
        component={
          businessUnitPermission?.isCreate ? AddForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/business-unit"
        component={BusinessUnit}
      />
      <ContentRoute
        path="/config/domain-controll/accountingConfig"
        component={AccountingConfigForm}
      />
      <ContentRoute
        path="/config/domain-controll/accountsControl"
        component={AccountsControlLanding}
      />
      <ContentRoute
        path="/config/domain-controll/create-user"
        component={CreateUser}
      />
      <ContentRoute
        path="/config/domain-controll/role-extension"
        component={roleExtension?.isView ? RoleExtension : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/user-group/add"
        component={
          userGroupPermission?.isCreate ? UserGroupAddForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/user-group/edit/:id"
        component={
          userGroupPermission?.isEdit ? UserGroupEditForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/user-group/view/:id"
        component={
          userGroupPermission?.isView ? UserGroupViewFrom : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/domain-controll/user-group"
        component={UserGroup}
      />
      <ContentRoute
        path="/config/domain-controll/user-group/add"
        component={
          userGroupPermission?.isCreate ? UserGroupAddForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/code-generate/edit/:id"
        component={
          codeGeneratePermission?.isEdit ? CodeGenerateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/code-generate/add"
        component={
          codeGeneratePermission?.isCreate ? CodeGenerateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/code-generate"
        component={CodeGenerate}
      />

      {/* Approval Set up */}
      <ContentRoute
        path="/config/domain-controll/approvalsetup/create"
        component={
          approvalSetupPermission?.isCreate
            ? ApprovalSetupCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/approvalsetup/view/:approvalId/:type"
        component={
          approvalSetupPermission?.isView
            ? ApprovalSetupCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/approvalsetup/edit/:approvalId"
        component={
          approvalSetupPermission?.isEdit
            ? ApprovalSetupCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/approvalsetup"
        component={ApprovalLanding}
      />

      {/* Price Structure GL */}
      <ContentRoute
        path="/config/domain-controll/priceStructureGL"
        component={PriceStructureGlLanding}
      />

      {/* Feature Group */}
      <ContentRoute
        path="/config/domain-controll/feature-group/edit/:id/:mId"
        component={FutureGroupForm}
      />
      <ContentRoute
        path="/config/domain-controll/feature-group/create"
        component={FutureGroupForm}
      />
      <ContentRoute
        from="/config/domain-controll/feature-group"
        component={FutureGroupLanding}
      />

      {/* Role Manager */}
      <ContentRoute
        path="/config/domain-controll/role-manager/edit/:id"
        component={roleManager?.isEdit ? RoleManagerForm : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/role-manager/create"
        component={roleManager?.isCreate ? RoleManagerForm : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/role-manager"
        component={roleManager?.isView ? RoleManager : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/report-role-manager-extension"
        component={
          roleManager?.isView ? ReportRoleManagerCreateForm : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/domain-controll/user-password"
        component={roleManager?.isView ? UserPassword : NotPermittedPage}
      />
      <ContentRoute
        path="/config/domain-controll/item-stock-update"
        component={ItemStockUpdate}
      />
    </Switch>
  );
}
