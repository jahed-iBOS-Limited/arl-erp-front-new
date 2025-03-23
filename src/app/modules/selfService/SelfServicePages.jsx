import React, { Suspense } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../../../_metronic/layout';
import DashboardPage from '../../pages/DashboardPage';
import NotPermittedPage from '../_helper/notPermitted/NotPermittedPage';
import MyAsset from './Assets';
import AchievementTable from './achievement/Table/table';
import AllReport from './allReport';
import { CommonApprovalTable } from './approval/commonApproval/Table/tableHeader';
import BusinessGlossaryReport from './businessGlossary';
import FoodCornerLanding from './cafeteriaMangement/foodCorner/landing';
import DispatchRequisitionCreateEdit from './dispatchRequsitoin/createEditForm';
import DispatchRequisitionLanding from './dispatchRequsitoin/index';
import ExpenseRegisterCreateForm from './expenseRegister/Create/addForm';
import { ExpenseRegister } from './expenseRegister/index';
import BasicInformationlLanding from './humanResource/employeeInformation/Table/form';
import OfficialInfoCollapsePanel from './humanResource/officialInformation/EditForm/mainCollapse';
import PersonalInfoCollapsePanel from './humanResource/personalInformation/EditForm/mainCollapse';
import Jobstation from './jobstation/Form/addEditForm';
import LeaveApprovalLanding from './leaveMovement/LeaveApproval/Landing/Landing';
import MovementApprovalLanding from './leaveMovement/MovementApproval/Landing/Landing';
import { LeaveAddForm } from './leaveMovement/leaveApplication/Form/addEditForm';
import { LeaveApplicationTable } from './leaveMovement/leaveApplication/Table/tableHeader';
import { MovementAddForm } from './leaveMovement/movementApplication/Form/addEditForm';
import { MovementApplicationTable } from './leaveMovement/movementApplication/Table/tableHeader';
import PayslipReport from './payslip';
import DailyAttendanceLanding from './report/dailyAttendance/Landing';
import TrainingLanding from './training';
import ViewTraining from './training/viewTraining';
import { ItemRequest } from './warehouse/itemRequest';
import ItemRequestForm from './warehouse/itemRequest/Form/addEditForm';
import ViewItemRequestForm from './warehouse/itemRequest/view/addEditForm';
import { ComplainManagement } from '../common/fetures';
import ResolutionLanding from '../common/fetures/complainManagement/resolution/landing';
export function SelfServicePages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual,
  );

  let officialInfo = null;
  // let personalInfo = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 88) {
      officialInfo = userRole[i];
    }
    // if (userRole[i]?.intFeatureId === 93) {
    //   personalInfo = userRole[i];
    // }
  }

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <div className="hcm-module">
        <Switch>
          <Redirect
            exact={true}
            from="/self-service"
            to="/self-service/self-profile"
          />
          <ContentRoute
            path="/self-service/self-profile/official/edit/:id"
            component={
              officialInfo?.isCreate
                ? OfficialInfoCollapsePanel
                : NotPermittedPage
            }
          />
          <ContentRoute
            path="/self-service/self-profile/personal/edit/:id"
            component={PersonalInfoCollapsePanel}
          />
          <ContentRoute
            path="/self-service/self-profile"
            component={BasicInformationlLanding}
          />
          <ContentRoute
            path="/self-service/self-dashboard"
            component={DashboardPage}
          />
          <ContentRoute
            path="/self-service/daily-attendance"
            component={DailyAttendanceLanding}
          />
          <ContentRoute
            path="/self-service/meal-entry"
            component={FoodCornerLanding}
          />
          <ContentRoute
            path="/self-service/kpi-target-entry"
            component={AchievementTable}
          />
          <ContentRoute
            from="/self-service/store-requisition/view/:id"
            component={ViewItemRequestForm}
          />
          <ContentRoute
            from="/self-service/store-requisition/edit/:id"
            component={ItemRequestForm}
          />
          <ContentRoute
            from="/self-service/store-requisition/add"
            component={ItemRequestForm}
          />
          <ContentRoute
            from="/self-service/store-requisition"
            component={ItemRequest}
          />
          <ContentRoute
            path="/self-service/tada-application/approval/:approval"
            component={ExpenseRegisterCreateForm}
          />
          <ContentRoute
            path="/self-service/tada-application/edit/:id"
            component={ExpenseRegisterCreateForm}
          />
          <ContentRoute
            path="/self-service/tada-application/create"
            component={ExpenseRegisterCreateForm}
          />
          <ContentRoute
            path="/self-service/tada-application"
            component={ExpenseRegister}
          />
          /index
          <ContentRoute
            path="/self-service/approval/leave-approval"
            component={LeaveApprovalLanding}
          />
          <ContentRoute
            path="/self-service/approval/movement-approval"
            component={MovementApprovalLanding}
          />
          <ContentRoute
            path="/self-service/approval/store-requisition-approval"
            component={CommonApprovalTable}
          />
          <ContentRoute
            path="/self-service/leave-application/create"
            component={LeaveAddForm}
          />
          <ContentRoute
            path="/self-service/leave-application"
            component={LeaveApplicationTable}
          />
          <ContentRoute
            path="/self-service/movement-application/create"
            component={MovementAddForm}
          />
          <ContentRoute
            path="/self-service/movement-application"
            component={MovementApplicationTable}
          />
          <ContentRoute
            path="/self-service/payslip"
            component={PayslipReport}
          />
          <ContentRoute path="/self-service/myasset" component={MyAsset} />
          <ContentRoute
            path="/self-service/mytraining/view/:id"
            component={ViewTraining}
          />
          <ContentRoute
            path="/self-service/mytraining"
            component={TrainingLanding}
          />
          <ContentRoute path="/self-service/SSOTReport" component={AllReport} />
          <ContentRoute
            path="/self-service/businessGlossary"
            component={BusinessGlossaryReport}
          />
          <ContentRoute
            path="/self-service/my-complaint"
            component={ResolutionLanding}
          />
          <ContentRoute path="/self-service/arl-map" component={Jobstation} />
          <ContentRoute
            path="/self-service/DispatchRequisition/edit/:id"
            component={DispatchRequisitionCreateEdit}
          />
          <ContentRoute
            path="/self-service/DispatchRequisition/create"
            component={DispatchRequisitionCreateEdit}
          />
          <ContentRoute
            path="/self-service/DispatchRequisition"
            component={DispatchRequisitionLanding}
          />
          {/* <ContentRoute
            path="/self-service/complainmanagement"
            component={ComplainManagementPages}
          /> */}
          <ContentRoute
            path="/self-service/complainmanagement"
            component={() => ComplainManagement("self-service")}
          />
        </Switch>
      </div>
    </Suspense>
  );
}

export default SelfServicePages;
