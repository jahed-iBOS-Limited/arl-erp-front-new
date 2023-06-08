import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import AdditionDeductionTypeForm from "./additionDeductionType/form/addEditForm";
import AdditionDeductionTypeLanding from "./additionDeductionType/landing/table";
import EmpSalaryAdditionDeductionLanding from "./empSalaryAdditionDeduction/landing/table";
import EmpSalaryAdditionDeductionForm from "./empSalaryAdditionDeduction/form/addEditForm";
import ManualSalaryAddNDeducForm from "./manualSalaryAddNDeduc";
import AllowanceDeducReport from "./allowanceDeducReport";
import { shallowEqual, useSelector } from "react-redux";
import NotPermitted from "../../performanceManagement/notPermittedPage/notPermitted";
import { TaxAssignForm } from "./taxAssign/form/addEditForm";
import TaxAssignLanding from "./taxAssign/landing/table";
import AttendanceBenefitLanding from "./attendanceBenefit/table";
// import EmpSalaryAdditionDeductionViewForm from "./empSalaryAdditionDeduction/view/addEditForm";

export function AdditionDeductionPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let allowanceDeducReportPermission = null;
  let taxAssignPermission = null;
  let attendanceBenefit = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 923) {
      allowanceDeducReportPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 924) {
      taxAssignPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1037) {
      attendanceBenefit = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/additionanddeduction"
      />

      {/* Addition Deduction Type */}
      <ContentRoute
        from="/human-capital-management/additionanddeduction/additiondeductiontype/create"
        component={AdditionDeductionTypeForm}
      />
      <ContentRoute
        from="/human-capital-management/additionanddeduction/additiondeductiontype"
        component={AdditionDeductionTypeLanding}
      />

      {/* Employee Salary Addition Deduction  */}
      {/* <ContentRoute
        from="/human-capital-management/additionanddeduction/salaryadditiondeduction/view/:id"
        component={EmpSalaryAdditionDeductionViewForm}
      /> */}
      <ContentRoute
        from="/human-capital-management/additionanddeduction/salaryadditiondeduction/create"
        component={EmpSalaryAdditionDeductionForm}
      />
      <ContentRoute
        from="/human-capital-management/additionanddeduction/salaryadditiondeduction/edit/:id"
        component={EmpSalaryAdditionDeductionForm}
      />
      <ContentRoute
        from="/human-capital-management/additionanddeduction/salaryadditiondeduction"
        component={EmpSalaryAdditionDeductionLanding}
      />

      {/* Manual Salary Add/Deduc  */}
      <ContentRoute
        from="/human-capital-management/additionanddeduction/manualsalaryadddeduc"
        component={ManualSalaryAddNDeducForm}
      />

      <ContentRoute
        from="/human-capital-management/additionanddeduction/AllowanceAndDeductionReport"
        component={
          allowanceDeducReportPermission?.isView
            ? AllowanceDeducReport
            : NotPermitted
        }
      />
      <ContentRoute
        from="/human-capital-management/additionanddeduction/TAXAmountAssign/create"
        component={taxAssignPermission?.isCreate ? TaxAssignForm : NotPermitted}
      />
      <ContentRoute
        from="/human-capital-management/additionanddeduction/TAXAmountAssign"
        component={
          taxAssignPermission?.isView ? TaxAssignLanding : NotPermitted
        }
      />
      <ContentRoute
        from="/human-capital-management/additionanddeduction/attendanceBenefit"
        component={
          attendanceBenefit?.isView ? AttendanceBenefitLanding : NotPermitted
        }
      />
      
    </Switch>
  );
}
