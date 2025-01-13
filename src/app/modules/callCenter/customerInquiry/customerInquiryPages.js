import React from "react";
import {
  // Redirect,
  Switch,
} from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import ComplainAndSolutionForm from "./complainAndSolution/form/addEditForm";
import ComplainAndSolutionTable from "./complainAndSolution/landing/table";
import CustomerLeadGeneration from "./customerLeadGeneration";
import CreateCustomerLeadGeneration from "./customerLeadGeneration/createPage";
import DeliveryInquiryLanding from "./deliveryInquiry/table/table";
import FollowUp from "./customerLeadGeneration/followUp";

export default function CustomerInquiryPages() {
  return (
    <Switch>
      {/* <Redirect exact={true} from="/call-center-management" to="" /> */}

      <ContentRoute
        path="/call-center-management/customer-inquiry/delivery-inquiry"
        component={DeliveryInquiryLanding}
      />
      <ContentRoute
        path="/call-center-management/customer-inquiry/complainnsolution/:type/:id"
        component={ComplainAndSolutionForm}
      />
      <ContentRoute
        path="/call-center-management/customer-inquiry/complainnsolution/create"
        component={ComplainAndSolutionForm}
      />
      <ContentRoute
        path="/call-center-management/customer-inquiry/complainnsolution"
        component={ComplainAndSolutionTable}
      />
      <ContentRoute
        path="/call-center-management/customer-inquiry/customerleadgeneration/followup/:id"
        component={FollowUp}
      />
      <ContentRoute
        path="/call-center-management/customer-inquiry/customerleadgeneration/update/:id"
        component={CreateCustomerLeadGeneration}
      />
      <ContentRoute
        path="/call-center-management/customer-inquiry/customerleadgeneration/create"
        component={CreateCustomerLeadGeneration}
      />
      <ContentRoute
        path="/call-center-management/customer-inquiry/customerleadgeneration"
        component={CustomerLeadGeneration}
      />
    </Switch>
  );
}
