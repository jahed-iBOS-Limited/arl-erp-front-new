import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import PrimaryDeliveryReceiveForm from "./primaryDeliveryReceive/Form/addEditForm";
import { PrimaryDeliveryReceiveLanding } from "./primaryDeliveryReceive/Table/tableHeader";
import SalesTargetCreateForm from "./salesTarget/Form/addEditForm";
import SalesTargetLanding from "./salesTarget/Table";
import SecondaryCollectionLanding from "./secondaryCollection/Table";
import { SecondaryOrderLanding } from "./secondaryOrder";
import SecondaryOrderForm from "./secondaryOrder/Form/addEditForm";
import RtmShipmentPGI from "./shipmentPGI";
import RtmShipmentCreateForm from "./shipmentPGI/Form/addEditForm";
import SecondaryDeliveryLanding from "./secondaryDelivery/landing/table";
import SecondaryCollectionForm from "./secondaryCollection/Form/addEditForm";
// import PrimaryCollectionLanding from "./primaryCollection/Table";
// import PrimaryCollectionForm from "./primaryCollection/Form/addEditForm";
// import PrimaryCollectionLanding from "./primaryCollection/Table/index";
import { PrimaryCollectionPaginationLanding } from './primaryCollection/index';
import PrimaryCollectionForm from "./primaryCollection/Form/addEditForm";

export function PrimarySalesPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/primarySale"
        to="/rtm-management/primarySale"
      />

      {/* sales target*/}
      <ContentRoute
        path="/rtm-management/primarySale/salesTarget/edit/:id"
        component={SalesTargetCreateForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/salesTarget/add"
        component={SalesTargetCreateForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/salesTarget"
        component={SalesTargetLanding}
      />

      {/* shipment PGI */}
      <ContentRoute
        path="/rtm-management/primarySale/shipment/edit/:id"
        component={RtmShipmentCreateForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/shipment/add"
        component={RtmShipmentCreateForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/shipment"
        component={RtmShipmentPGI}
      />

      {/* Secondary Order */}
      <ContentRoute
        path="/rtm-management/primarySale/secondaryOrder/edit/:id"
        component={SecondaryOrderForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/secondaryOrder/add"
        component={SecondaryOrderForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/secondaryOrder"
        component={SecondaryOrderLanding}
      />

      {/* Primary Delivery Receive */}
      <ContentRoute
        path="/rtm-management/primarySale/primaryDeliveryReceive/edit/:id"
        component={PrimaryDeliveryReceiveForm}
      />

      <ContentRoute
        path="/rtm-management/primarySale/primaryDeliveryReceive/create"
        component={PrimaryDeliveryReceiveForm}
      />

      <ContentRoute
        path="/rtm-management/primarySale/primaryDeliveryReceive"
        component={PrimaryDeliveryReceiveLanding}
      />
      {/* Secondary Collection */}
      <ContentRoute
        path="/rtm-management/primarySale/secondaryCollection/view/:id"
        component={SecondaryCollectionForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/secondaryCollection"
        component={SecondaryCollectionLanding}
      />
      {/* Secondary Delivery */}
      <ContentRoute
        path="/rtm-management/primarySale/secondaryDelivery"
        component={SecondaryDeliveryLanding}
      />
      {/* 
      Primary Collection */}
      <ContentRoute
        path="/rtm-management/primarySale/primaryCollection/edit/:id"
        component={PrimaryCollectionForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/primaryCollection/add"
        component={PrimaryCollectionForm}
      />
      <ContentRoute
        path="/rtm-management/primarySale/primaryCollection"
        component={PrimaryCollectionPaginationLanding}
      />
    </Switch>
  );
}
export default PrimarySalesPages;
