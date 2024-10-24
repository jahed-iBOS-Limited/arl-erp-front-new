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
import CostElementMainIndex from "./costElement/costElementMainIndex.js";

function CostingPricingModel() {
  const [isModalShowObj, setIsModalShowObj] = React.useState({
    isProductCreate: false,
  });

  const [costingConfiguration, setCostingConfiguration] = React.useState(
    "PRODUCT"
  );

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
            {costingConfiguration === "PRODUCT" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (costingConfiguration === "PRODUCT") {
                    setIsModalShowObj({
                      ...isModalShowObj,
                      isProductCreate: true,
                      isCostElementCreate: false,
                    });
                  } else {
                    setIsModalShowObj({
                      ...isModalShowObj,
                      isProductCreate: false,
                      isCostElementCreate: true,
                    });
                  }
                }}
              >
                Create
              </button>
            )}
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div>
            <Tabs
              defaultActiveKey="product"
              id="uncontrolled-tab-example"
              className="mb-3"
              onSelect={(key) => {
                if (key === "product") {
                  setCostingConfiguration("PRODUCT");
                } else if (key === "cost-element-costing") {
                  setCostingConfiguration("COST_ELEMENT");
                }
              }}
            >
              <Tab unmountOnExit eventKey="product" title="Product"></Tab>
              <Tab
                unmountOnExit
                eventKey="cost-element-costing"
                title="Cost Element Costing"
              ></Tab>
            </Tabs>
          </div>
          {costingConfiguration === "PRODUCT" ? (
            <ProductMainIndex
              isModalShowObj={isModalShowObj}
              setIsModalShowObj={setIsModalShowObj}
              costingConfiguration={costingConfiguration}
            />
          ) : (
            <CostElementMainIndex
              isModalShowObj={isModalShowObj}
              setIsModalShowObj={setIsModalShowObj}
              costingConfiguration={costingConfiguration}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default CostingPricingModel;
