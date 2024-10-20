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

import ProductMainIndex from "./product/productMainIndex.js";

function CostingPricingModel() {
  const [isModalShowObj, setIsModalShowObj] = React.useState({
    isProductCreate: false,
  });

  const { userRole, selectedBusinessUnit, profileData } = useSelector(
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
          <CardHeaderToolbar>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setIsModalShowObj({
                  ...isModalShowObj,
                  isProductCreate: true,
                });
              }}
            >
              Create
            </button>
          </CardHeaderToolbar>
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
                eventKey="cost-element-costing"
                title="Cost Element Costing"
              ></Tab>
            </Tabs>
          </div>
          <ProductMainIndex
            isModalShowObj={isModalShowObj}
            setIsModalShowObj={setIsModalShowObj}
          />
        </CardBody>
      </Card>
    </>
  );
}

export default CostingPricingModel;
