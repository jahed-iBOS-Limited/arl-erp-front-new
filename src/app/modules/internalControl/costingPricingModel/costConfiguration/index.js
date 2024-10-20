/* eslint-disable */

import React, { useMemo } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";

function CostingPricingModel() {
  const { userRole, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const permissionForAdministration = useMemo(
    () => userRole?.find((item) => item?.intFeatureId === 1276),
    []
  );
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"Costing Configuration"}>
          <CardHeaderToolbar></CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div>
            <Tabs
              defaultActiveKey="product"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab unmountOnExit eventKey="product" title="Product"></Tab>
              <Tab
                unmountOnExit
                eventKey="product-to-fg"
                title="Product To Finish Good"
              >
                {/* <SecondWeight /> */}
              </Tab>
              <Tab
                unmountOnExit
                eventKey="product-to-material"
                title="Product To Material"
              >
                {/* <QualityCheck /> */}
              </Tab>
              <Tab
                unmountOnExit
                eventKey="cost-element-costing"
                title="Cost Element Costing"
              >
                {/* <WeightmentReport /> */}
              </Tab>
            </Tabs>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default CostingPricingModel;
