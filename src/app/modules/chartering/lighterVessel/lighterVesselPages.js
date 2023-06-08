import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ConsigneeTable from "./consignee/table/table";
import InvoiceForm from "./invoice/Form/addEditForm";
import InvoiceTable from "./invoice/table/table";
import LighterVesselInfo from "./lighterVesselInfo/table/table";
import LighterVesselReportPages from "./reports/reportPages";
import SurveyVesselTable from "./surveyVessel/table/table";
import TripForm from "./trip/Form/_addEditForm";
import TripLanding from "./trip/table/table";

export function LighterVesselPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/chartering/lighterVessel"
        to="/chartering/lighterVessel/lighterVesselInfo"
      />

      {/* Lighter Vessel Info */}
      <Route
        path="/chartering/lighterVessel/lighterVesselInfo"
        component={LighterVesselInfo}
      />

      {/* Trip */}
      <Route
        path="/chartering/lighterVessel/lighterVesselVoyage/:type/:id"
        component={TripForm}
      />
      <Route
        path="/chartering/lighterVessel/lighterVesselVoyage/create"
        component={TripForm}
      />
      <Route
        path="/chartering/lighterVessel/lighterVesselVoyage"
        component={TripLanding}
      />
      
      {/* Survey Vessel */}
     <Route
        path="/chartering/lighterVessel/surveyVessel"
        component={SurveyVesselTable}
      />

      {/* Consignee */}
      <Route
        path="/chartering/lighterVessel/consignee"
        component={ConsigneeTable}
      />

      {/* Reports */}
      <Route
        path="/chartering/lighterVessel/lighterVesselReport"
        component={LighterVesselReportPages}
      />

      {/* Invoice */}
      <Route
        path="/chartering/lighterVessel/lighterInvoice/create"
        component={InvoiceForm}
      />
      <Route
        path="/chartering/lighterVessel/lighterInvoice"
        component={InvoiceTable}
      />
    </Switch>
  );
}
export default LighterVesselPages;
