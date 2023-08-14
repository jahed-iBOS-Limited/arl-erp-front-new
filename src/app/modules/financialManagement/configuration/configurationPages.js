import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import GeneralLedger from "./generalLedger";
// import GeneralLedgerForm from "./generalLedger/Form/addEditForm";
import { shallowEqual, useSelector } from "react-redux";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import { BankAccount } from "./bankAccount";
import BankAccountForm from "./bankAccount/Form/addEditForm";
import DisbursementCenterForm from "./disbursementCenter/Form/addEditForm";
import DisbursementCenter from "./disbursementCenter/Table/index";
import { FinacialStatementForm } from "./financialStatement/form/addEditForm";
import FinancialStateMent from "./financialStatement/landing/landing";
import { FinacialStatementViewForm } from "./financialStatement/view/addEditForm";
import GeneralLadgerEditForm from "./generalLedger/Create/collpaseComponent/generalLadger/generalLadger";
import MainCollapsePanel from "./generalLedger/Create/mainCollapse";
import GeneralLedgerExtendPage from "./generalLedger/extendPage/extendPage";
import SbuAddForm from "./sbu/WarehouseCreate/addForm";
import SbuEditForm from "./sbu/businessUnitEdit/editForm";
import { Sbu } from "./sbu/index";
// import AllGlExtendPage from './generalLedger/allGlExtend/Table/tableRow'
import findIndex from "../../_helper/_findIndex";
import BankBranch from "./bankBranch/index";
import BareboatInsuranceConfig from "./bareboatCharterer";
import BareboatChartererConfigCreateEdit from "./bareboatCharterer/createEdit";
import ChequePrintSetupForm from "./chequePrintSetup/Form/addEditForm";
import { ChequePrintSetup } from "./chequePrintSetup/index";
import AllextendGLForm from "./generalLedger/allGlExtend/allGLExtend/Form/addEditForm";
import SalaryJvConfigLanding from "./salaryJvConfig";
import SalaryJvConfigCreateEdit from "./salaryJvConfig/createEdit";
import BankStatementAutomation from "./bankStatementAutomation";

export function FinConfigurationPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const SBUPermission = userRole[findIndex(userRole, "SBU")];
  const generalLedgerPermissions =
    userRole[findIndex(userRole, "General Ladger")];
  const bankAccountPermissions = userRole[findIndex(userRole, "Bank Account")];
  const disbursementCenterPermission =
    userRole[findIndex(userRole, "Disbursement Center")];
  const financialStatementConfig =
    userRole[findIndex(userRole, "Financial Statement Config")];
  const salaryJvConfig = userRole[findIndex(userRole, "Salary JV Config")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from='/financial-management/configuration'
        to='/financial-management/configuration/general-ladger'
      />
      {/* General ledger routes */}
      <ContentRoute
        from='/financial-management/configuration/general-ladger/allGlExtend'
        component={AllextendGLForm}
      />

      <ContentRoute
        from='/financial-management/configuration/general-ladger/extend/:id'
        component={
          generalLedgerPermissions?.isCreate
            ? GeneralLedgerExtendPage
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/general-ladger/add'
        component={
          generalLedgerPermissions?.isCreate
            ? MainCollapsePanel
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/general-ladger/edit/:id'
        component={
          generalLedgerPermissions?.isEdit
            ? GeneralLadgerEditForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/general-ladger'
        component={GeneralLedger}
      />

      {/* Bank Account routes */}
      <ContentRoute
        from='/financial-management/configuration/bank-account/add'
        component={
          bankAccountPermissions?.isCreate ? BankAccountForm : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/bank-account/edit/:id'
        component={
          bankAccountPermissions?.isEdit ? BankAccountForm : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/bank-account'
        component={BankAccount}
      />
      {/* DisbursementCenter routes */}
      <ContentRoute
        from='/financial-management/configuration/disbursementCenter/edit/:id'
        component={
          disbursementCenterPermission?.isEdit
            ? DisbursementCenterForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/disbursementCenter/add'
        component={
          disbursementCenterPermission?.isCreate
            ? DisbursementCenterForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/disbursementCenter'
        component={DisbursementCenter}
      />

      {/* Sbu Route */}
      <ContentRoute
        path='/financial-management/configuration/sbu/add'
        component={SBUPermission?.isCreate ? SbuAddForm : NotPermittedPage}
      />
      <ContentRoute
        path='/financial-management/configuration/sbu/edit/:id'
        component={SBUPermission?.isEdit ? SbuEditForm : NotPermittedPage}
      />
      <ContentRoute
        path='/financial-management/configuration/sbu'
        component={Sbu}
      />

      <ContentRoute
        from='/financial-management/configuration/financialStatement/view/:comId/:busId'
        component={
          financialStatementConfig?.isView
            ? FinacialStatementViewForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/financialStatement/add/:comId/:busId'
        component={
          financialStatementConfig?.isCreate
            ? FinacialStatementForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from='/financial-management/configuration/financialStatement'
        component={FinancialStateMent}
      />
      {/* Bank Branch routes */}
      <ContentRoute
        path='/financial-management/configuration/bankbranch'
        component={BankBranch}
      />

      {/* Cheque Print routes */}
      <ContentRoute
        path='/financial-management/configuration/chequePrintSetup/add'
        component={ChequePrintSetupForm}
      />
      <ContentRoute
        path='/financial-management/configuration/chequePrintSetup'
        component={ChequePrintSetup}
      />

      <ContentRoute
        path='/financial-management/configuration/bareboatCharterConfig/edit/:id'
        component={BareboatChartererConfigCreateEdit}
      />
      <ContentRoute
        path='/financial-management/configuration/bareboatCharterConfig/create'
        component={BareboatChartererConfigCreateEdit}
      />
      <ContentRoute
        path='/financial-management/configuration/bareboatCharterConfig'
        component={BareboatInsuranceConfig}
      />
      <ContentRoute
        path='/financial-management/configuration/SalaryJVConfig/edit'
        component={
          salaryJvConfig?.isEdit ? SalaryJvConfigCreateEdit : NotPermittedPage
        }
      />
      <ContentRoute
        path='/financial-management/configuration/SalaryJVConfig/create'
        component={
          salaryJvConfig?.isCreate ? SalaryJvConfigCreateEdit : NotPermittedPage
        }
      />
      <ContentRoute
        path='/financial-management/configuration/SalaryJVConfig'
        component={
          salaryJvConfig?.isView ? SalaryJvConfigLanding : NotPermittedPage
        }
      />
      <ContentRoute
        path='/financial-management/configuration/bank-statement-automation'
        component={BankStatementAutomation}
      />
    </Switch>
  );
}
