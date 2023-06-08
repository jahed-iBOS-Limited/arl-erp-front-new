/* eslint-disable */

import React from "react";
import { useMemo } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import FirstWeight from "../firstWeight";
import QualityCheck from "../qualityCheck";
import SecondWeight from "../secondWeight";
import AdministrationForWeighment from "./administrationForWeighment";
import WeightmentReport from "./report";

function QcAndWeighment() {
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
        <CardHeader title={"QC & Weighment"}>
          <CardHeaderToolbar></CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div>
            <Tabs
              defaultActiveKey="first-weight"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab unmountOnExit eventKey="first-weight" title="First Weight">
                <FirstWeight />
              </Tab>
              <Tab unmountOnExit eventKey="second-weight" title="Second Weight">
                <SecondWeight />
              </Tab>
              {(selectedBusinessUnit?.value === 171 ||
                selectedBusinessUnit?.value === 224) && (
                <Tab unmountOnExit eventKey="quality-check" title="QC">
                  <QualityCheck />
                </Tab>
              )}
              {selectedBusinessUnit?.value !== 171 &&
                selectedBusinessUnit?.value !== 224 && (
                  <Tab
                    unmountOnExit
                    eventKey="weightment-report"
                    title="Report"
                  >
                    <WeightmentReport />
                  </Tab>
                )}
              {permissionForAdministration?.isCreate ? (
                <Tab
                  unmountOnExit
                  eventKey="administration"
                  title="Administration"
                >
                  <AdministrationForWeighment />
                </Tab>
              ) : (
                <></>
              )}
            </Tabs>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default QcAndWeighment;
