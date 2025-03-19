import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { ContentRoute } from '../../../../_metronic/layout'
import RenewalRegLanding from './renewalRegistration/table'
import { WorkOrderPage } from './workOrder'
import MaintenanceServiceForm from './workOrder/Form/addEditForm'
import { shallowEqual, useSelector } from 'react-redux'
import NotPermittedPage from '../../_helper/notPermitted/NotPermittedPage'
import RenewalRegApproval from './renewalRegApproval/table'
import { ServiceRequest } from './serviceRequest'
import ConfigRenewalAttribute from './renewalAttributeConfig'

export function MaintenancePages() {

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let ASSET_Renewal_Registration_Approval = null;
  let ASSET_Renewal_Registration = null;
  let workOrderPermission = null;
  let serviceRequestPermission = null;
  let renewalAttributeConfig = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 207) {
      workOrderPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 208) {
      ASSET_Renewal_Registration = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1007) {
      ASSET_Renewal_Registration_Approval = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1042) {
      serviceRequestPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1264) {
      renewalAttributeConfig = userRole[i];
    }
  }
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/mngAsset"
        to="/mngAsset/maintenance"
      />

      {/* Work Order */}
      <ContentRoute
        from="/mngAsset/maintenance/workorder/edit/:id"
        component={workOrderPermission?.isEdit ? MaintenanceServiceForm : NotPermittedPage}
      />
      <ContentRoute
        from="/mngAsset/maintenance/workorder"
        component={workOrderPermission?.isView ? WorkOrderPage : NotPermittedPage}
      />

      <ContentRoute
        from="/mngAsset/maintenance/RenewalRegistration/edit/:id"
        component={ASSET_Renewal_Registration?.isEdit ? MaintenanceServiceForm : NotPermittedPage}
      />
      <ContentRoute
        from="/mngAsset/maintenance/RenewalRegistration"
        component={ASSET_Renewal_Registration?.isView ? RenewalRegLanding : NotPermittedPage}
      />
      <ContentRoute
        from="/mngAsset/maintenance/RenewalRegistrationApproval"
        component={ASSET_Renewal_Registration_Approval?.isView ? RenewalRegApproval : NotPermittedPage}
      />
      <ContentRoute
        from="/mngAsset/maintenance/serviceRequest"
        component={serviceRequestPermission?.isView ? ServiceRequest : NotPermittedPage}
      />
      <ContentRoute
        from="/mngAsset/maintenance/RenewalAttributeConfig"
        component={renewalAttributeConfig?.isView ? ConfigRenewalAttribute : NotPermittedPage}
      />
    </Switch>
  )
}
