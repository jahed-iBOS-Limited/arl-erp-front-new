import React, { useState } from "react";
import { ITableTwo } from "./../../../../_helper/_tableTwo";
import HeaderForm from "./form";

import { Route } from "react-router-dom";
import ViewForm from "../View/viewModal";
import "../salesOrder.css";
import { useDispatch } from "react-redux";
import { setSalesOrderSingleEmpty } from "./../_redux/Actions";
export default function SalesOrderLandingPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <ITableTwo
        renderProps={() => (
          <>
            <HeaderForm loading={loading} setLoading={setLoading} />
          </>
        )}
        title="Sales Order"
        viewLink=""
        isHidden={true}
      ></ITableTwo>

      <Route path="/sales-management/ordermanagement/salesorder/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/sales-management/ordermanagement/salesorder");
              dispatch(setSalesOrderSingleEmpty());
            }}
          />
        )}
      </Route>
      <Route path="/sales-management/ordermanagement/salesorder/:type/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            isLoading={setLoading}
            onHide={() => {
              history.push("/sales-management/ordermanagement/salesorder");
              dispatch(setSalesOrderSingleEmpty());
            }}
          />
        )}
      </Route>
    </>
  );
}
