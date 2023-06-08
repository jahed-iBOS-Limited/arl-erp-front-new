import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import CommercialInvoiceLanding from "./commercialInvoice";
import CommercialInvoiceCreateEdit from "./commercialInvoice/createEdit";
import PackingAndWeightListLanding from "./packingAndWeightList";
import PackingAndWeightListCreateEdit from "./packingAndWeightList/createEdit";
import SalesContractLanding from "./salesContract";
import SalesContractCreateEdit from "./salesContract/createEdit";
import SalesOrderLanding from "./salesOrder";
import SalesOrderCreateEdit from "./salesOrder/createEdit";

export function ExportTransactionPages() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from="/managementExport/exptransaction"
                to="/managementExport/exptransaction/salescontract"
            />
            {/* sales contract */}
            <ContentRoute
                path="/managementExport/exptransaction/salescontract/edit/:id"
                component={SalesContractCreateEdit}
            />
            <ContentRoute
                path="/managementExport/exptransaction/salescontract/create"
                component={SalesContractCreateEdit}
            />
            <ContentRoute
                path="/managementExport/exptransaction/salescontract"
                component={SalesContractLanding}
            />
            {/* commercial invoice */}
            <ContentRoute
                path="/managementExport/exptransaction/commercialinvoice/edit/:id"
                component={CommercialInvoiceCreateEdit}
            />
            <ContentRoute
                path="/managementExport/exptransaction/commercialinvoice/create"
                component={CommercialInvoiceCreateEdit}
            />
            <ContentRoute
                path="/managementExport/exptransaction/commercialinvoice"
                component={CommercialInvoiceLanding}
            />
            {/* sales order */}
            <ContentRoute
                path="/managementExport/exptransaction/salesorder/edit/:id"
                component={SalesOrderCreateEdit}
            />
            <ContentRoute
                path="/managementExport/exptransaction/salesorder/create"
                component={SalesOrderCreateEdit}
            />
            <ContentRoute
                path="/managementExport/exptransaction/salesorder"
                component={SalesOrderLanding}
            />
            {/* packing and weight list */}
            <ContentRoute
                path="/managementExport/exptransaction/packingnweightlist/edit/:id"
                component={PackingAndWeightListCreateEdit}
            />
            <ContentRoute
                path="/managementExport/exptransaction/packingnweightlist/create"
                component={PackingAndWeightListCreateEdit}
            />
            <ContentRoute
                path="/managementExport/exptransaction/packingnweightlist"
                component={PackingAndWeightListLanding}
            />
        </Switch>
    );
}

export default ExportTransactionPages;
