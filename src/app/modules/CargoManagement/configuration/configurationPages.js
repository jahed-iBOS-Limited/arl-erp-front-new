import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import CreateDeliveryAgent from "./createDeliveryAgent";
import DeliveryAgentList from "./deliveryAgentList";

export function ConfigurationPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/cargoManagement'
                to='/cargoManagement/configuration'
            />
            <ContentRoute
                path='/cargoManagement/configuration/delivery-agent-create'
                component={CreateDeliveryAgent}
            />
            <ContentRoute
                path='/cargoManagement/configuration/delivery-agent-edit/:id'
                component={CreateDeliveryAgent}
            />
            <ContentRoute
                path='/cargoManagement/configuration/delivery-agent-list'
                component={DeliveryAgentList}
            />

        </Switch>
    );
}
export default ConfigurationPages;
