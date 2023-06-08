import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import NotPermittedPage from "../_helper/notPermitted/NotPermittedPage";
import CreateDocument from "./createDocument/index";
import CreateDocumentLanding from "./createDocument/landing";
import DocSummaryReport from "./docSummaryReport";
import { LegalDocRegistration } from "./legalDocRegistration/form/addEditForm";
import LegalDocReport from "./legalDocReport";

export function NestedSfPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let createDocument = null;
  let legalDocReg = null;
  let legalDocReport = null;
  let docSummaryReport = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1013) {
      createDocument = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1014) {
      legalDocReg = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1017) {
      legalDocReport = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1021) {
      docSummaryReport = userRole[i];
    }
  }
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/safety-compliance/nestedsf"
        to="/safety-compliance/nestedsf"
      />
      <ContentRoute
        from="/safety-compliance/nestedsf/legal-document-name-create"
        component={createDocument?.isCreate ? CreateDocument : NotPermittedPage}
      />
      <ContentRoute
        from="/safety-compliance/nestedsf/legal-document-name-create/edit/:id"
        component={createDocument?.isEdit ? CreateDocument : NotPermittedPage}
      />
      <ContentRoute
        from="/safety-compliance/nestedsf/legal-document-name-landing"
        component={
          createDocument?.isView ? CreateDocumentLanding : NotPermittedPage
        }
      />
      <ContentRoute
        from="/safety-compliance/nestedsf/legal-document-registration"
        component={
          legalDocReg?.isCreate ? LegalDocRegistration : NotPermittedPage
        }
      />
      <ContentRoute
        from="/safety-compliance/nestedsf/legal-document-registration/edit/:id"
        component={
          legalDocReg?.isEdit ? LegalDocRegistration : NotPermittedPage
        }
      />
      <ContentRoute
        from="/safety-compliance/nestedsf/legal-document-report"
        component={legalDocReport?.isView ? LegalDocReport : NotPermittedPage}
      />

      <ContentRoute
        from="/safety-compliance/nestedsf/documentation-summary"
        component={
          docSummaryReport?.isView ? DocSummaryReport : NotPermittedPage
        }
      />
    </Switch>
  );
}
