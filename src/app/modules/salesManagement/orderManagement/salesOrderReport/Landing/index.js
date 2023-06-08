import React from "react";
import { ITableTwo } from "./../../../../_helper/_tableTwo";
import HeaderForm from "./form";

import { Route } from "react-router-dom";
import ViewForm from "../View/viewModal";
import "../salesOrder.css";
import { useDispatch } from "react-redux";
import { setSalesOrderSingleEmpty } from "./../_redux/Actions";
export default function SalesOrderReportLandingPage() {
  const dispatch = useDispatch();
  return (
    <>
      <ITableTwo
        renderProps={() => (
          <>
            <HeaderForm />
          </>
        )}
        title="Sales Order"
        viewLink=""
        isHidden={true}
      ></ITableTwo>

      <Route path="/sales-management/ordermanagement/salesOrderReportVat/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/sales-management/ordermanagement/salesOrderReportVat");
              dispatch(setSalesOrderSingleEmpty());
            }}
          />
        )}
      </Route>
    </>
  );
}
