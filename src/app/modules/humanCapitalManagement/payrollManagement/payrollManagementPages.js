import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import RemunerationGenerateReport from "./remunerationGenerate";
import BonusGenerateReport from "./bonusGenerate/index";
import BonusApproval from "./bonusApproval";
import { SalaryApprovalReport } from "./salaryApproval/Form/AddEditForm";
import SalaryApprovalDetailsTable from "./salaryApproval/DetailsTable";
import { SalaryGenerateNew } from "./salaryGenerateNew/Form/addEditFrom";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import SalaryPayInBank from "./salaryPayInBank";
import SalaryPayInBankForm from "./salaryPayInBank/form/addEditForm";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";

export function PayrollManagementPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let salaryGeneratePermission = null;
  let salaryPayInBankFormPermission = null;
  let bonusGeneratePermission = null;
  let bonusApprovalPermission = null;
  let salaryApprovalPermission = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 914) {
      salaryGeneratePermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 925) {
      salaryPayInBankFormPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 845) {
      bonusGeneratePermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 849) {
      bonusApprovalPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 998) {
      salaryApprovalPermission = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/payrollmanagement"
      />

      {/* Remuneration Generate*/}
      <ContentRoute
        path="/human-capital-management/payrollmanagement/remunerationgenerate"
        component={RemunerationGenerateReport}
      />

      {/* Bonus Generate*/}
      <ContentRoute
        path="/human-capital-management/payrollmanagement/bonusgenerate"
        component={bonusGeneratePermission?.isCreate ? BonusGenerateReport : NotPermitted}
      />

      {/* Bonus Approval */}
      <ContentRoute
        path="/human-capital-management/payrollmanagement/bonusapporval"
        component={bonusApprovalPermission?.isCreate ? BonusApproval : NotPermitted}
      />
      <ContentRoute
        path="/human-capital-management/payrollmanagement/salarygenerate"
        component={
          salaryGeneratePermission?.isCreate
            ? SalaryGenerateNew
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/payrollmanagement/salaryapproval/details"
        component={salaryApprovalPermission?.isCreate ? SalaryApprovalDetailsTable : NotPermitted}
      />
      <ContentRoute
        path="/human-capital-management/payrollmanagement/salaryapproval"
        component={salaryApprovalPermission?.isCreate ? SalaryApprovalReport : NotPermitted}
      />

      {/* SalaryPayInBank */}
      <ContentRoute
        path="/human-capital-management/payrollmanagement/SalaryPayInBank/create"
        component={
          salaryPayInBankFormPermission?.isCreate
            ? SalaryPayInBankForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/human-capital-management/payrollmanagement/SalaryPayInBank"
        component={
          salaryPayInBankFormPermission?.isView
            ? SalaryPayInBank
            : NotPermittedPage
        }
      />
    </Switch>
  );
}
