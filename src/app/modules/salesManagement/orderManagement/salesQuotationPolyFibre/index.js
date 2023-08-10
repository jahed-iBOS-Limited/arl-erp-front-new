import React from "react";
import { SalesQuotationTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router";
import SalesQuotationViewForm from "./ViewForm/addEditForm";

export default function SalesQuotationPolyFibre({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <Route path="/sales-management/ordermanagement/salesquotation/view/:view">
        {({ history, match }) => (
          <SalesQuotationViewForm
            show={match != null}
            id={match && match.params.view}
            history={history}
            onHide={() => {
              history.push("/sales-management/ordermanagement/salesquotation");
            }}
          />
        )}
      </Route>
      <SalesQuotationTable />
    </UiProvider>
  );
}
