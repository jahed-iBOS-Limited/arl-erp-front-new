import React from "react";
import { TradeOfferItemGroupTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { Route } from "react-router-dom";
import  ViewForm  from "./View/viewModal";

export default function TradeOfferItemGroup({ history }) {
    const uIEvents = {
        openViewDialog: (id) => {
            history.push(`/config/material-management/tradeofferitemgroup/view/${id}`);
        },
        openEditPage: (id) => {
            history.push(`/config/material-management/tradeofferitemgroup/edit/${id}`);
        }
    };

    return (
        <UiProvider uIEvents={uIEvents}>
            <Route path="/config/material-management/tradeofferitemgroup/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/config/material-management/tradeofferitemgroup")
            }} />
        )}
      </Route>
            <TradeOfferItemGroupTable />
        </UiProvider>
    );
};