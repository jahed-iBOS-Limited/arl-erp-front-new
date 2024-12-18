import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import NotPermittedPage from '../../_helper/notPermitted/NotPermittedPage';
import OvertimeApprovalLanding from './overtimeApproval/Landing/Landing';
import { OverTimeEntry } from './overTimeEntry/Form/AddEditForm';
import { OverTimeReport } from './overTimeReport/Form/AddEditForm';
import { OverTimeRequisition } from './overTimeRequisition/Form/AddEditForm';
import OvertimeRequisitionLanding from './overTimeRequisition/table/Landing';
import OvertimeRequisitionApprovalLanding from './overtimeRequisitionApproval/Landing/Landing';
import { ProcessReport } from './processReport/form/addEditFrom';
import { PumpFoodingBill } from './pumpFoodingBill/Form/AddEditForm';
import PumpFoodingBillLanding from './pumpFoodingBill/landing/table';
import PumpFoodingBillReport from './pumpFoodingBillReport';

export function OverTimeManagementPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let overtimeApprove = null;
  let overtimeRequisitionApprove = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 884) {
      overtimeApprove = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 831) {
      overtimeRequisitionApprove = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/human-capital-management"
        to="/human-capital-management/overtime-management"
      />
      <ContentRoute
        path="/human-capital-management/overtime-management/overtimeEntry"
        component={OverTimeEntry}
      />
      <ContentRoute
        path="/human-capital-management/overtime-management/overtimeReport"
        component={OverTimeReport}
      />

      <ContentRoute
        path="/human-capital-management/overtime-management/overtimerequisition/create"
        component={OverTimeRequisition}
      />
      <ContentRoute
        path="/human-capital-management/overtime-management/overtimerequisition"
        component={OvertimeRequisitionLanding}
      />

      <ContentRoute
        path="/human-capital-management/overtime-management/overtimeentryapproval"
        component={
          overtimeApprove?.isView ? OvertimeApprovalLanding : NotPermittedPage
        }
      />

      <ContentRoute
        path="/human-capital-management/overtime-management/overtimeapproval"
        component={
          overtimeRequisitionApprove?.isView
            ? OvertimeRequisitionApprovalLanding
            : NotPermittedPage
        }
      />

      <ContentRoute
        path="/human-capital-management/overtime-management/otreqprocessreport"
        component={ProcessReport}
      />

      <ContentRoute
        path="/human-capital-management/overtime-management/pumpfoodingbill/entry"
        component={PumpFoodingBill}
      />
      <ContentRoute
        path="/human-capital-management/overtime-management/pumpfoodingbill"
        component={PumpFoodingBillLanding}
      />
      <ContentRoute
        path="/human-capital-management/overtime-management/pumpfoodingbillreport"
        component={PumpFoodingBillReport}
      />
    </Switch>
  );
}
