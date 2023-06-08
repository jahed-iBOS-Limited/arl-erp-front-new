import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import RequisitionApproval from "./requisitionApproval";
import TrainingRequisitionApprovalEdit from "./requisitionApproval/editForm/addEditForm";
import RequisitionApprovalView from "./requisitionApproval/view";
import TrainingAttendence from "./trainingAttendence";
import TrainingRequisitionCreateForm from "./trainingRequisition/Form/addEditForm";
import TrainingSchedule from "./trainingSchedule";
import TrainingScheduleCreateForm from "./trainingSchedule/Form/addEditForm";
// import TrainingSchedule from "./trainingSchedule";

export function TrainingPages() {

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let trainingSchedule = null;
  let trainingRequisition = null;
  let trainingRequestApproval = null;
  let trainingAttendence = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1128) {
      trainingSchedule = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1129) {
      trainingRequisition = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1130) {
      trainingRequestApproval = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1131) {
      trainingAttendence = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/learningDevelopment"
        to="/learningDevelopment/training"
      />
      <ContentRoute
        path="/learningDevelopment/training/schedule/edit/:id"
        component={trainingSchedule?.isEdit ? TrainingScheduleCreateForm : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/training/schedule/create"
        component={trainingSchedule?.isCreate ? TrainingScheduleCreateForm : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/training/schedule"
        component={trainingSchedule?.isView ? TrainingSchedule : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/training/requisition"
        component={trainingRequisition?.isView ? TrainingRequisitionCreateForm : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/training/approval/edit/:editId"
        component={trainingRequestApproval?.isCreate ? TrainingRequisitionApprovalEdit : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/training/approval/view/:viewId"
        component={trainingRequestApproval?.isView ? RequisitionApprovalView : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/training/approval"
        component={trainingRequestApproval?.isView ? RequisitionApproval : NotPermittedPage}
      />
      <ContentRoute
        path="/learningDevelopment/training/attendance"
        component={trainingAttendence?.isView ? TrainingAttendence : NotPermittedPage}
      />
    </Switch>
  );
}
