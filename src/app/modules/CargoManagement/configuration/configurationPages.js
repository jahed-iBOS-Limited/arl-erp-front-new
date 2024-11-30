import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import BusinessPartnerList from "./BusinessPartnerList";
import CreateBusinessPartner from "./CreateBusinessPartner";

export function ConfigurationPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from='/cargoManagement'
                to='/cargoManagement/configuration'
            />
            <ContentRoute
                path='/cargoManagement/configuration/business-partner-create'
                component={CreateBusinessPartner}
            />
            <ContentRoute
                path='/cargoManagement/configuration/business-partner-edit/:id'
                component={CreateBusinessPartner}
            />
            <ContentRoute
                path='/cargoManagement/configuration/assign'
                component={BusinessPartnerList}
            />

        </Switch>
    );
}
export default ConfigurationPages;
