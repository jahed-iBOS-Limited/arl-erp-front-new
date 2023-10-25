/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls/Card";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import printIcon from "../../../../_helper/images/print-icon.png";
import { GetTripCostReport_api } from "../helper";
import NewSelect from "./../../../../_helper/_select";
import "./style.css";
import Table from "./table";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" },
  channel: "",
  region: "",
  area: "",
  territory: "",
};

const reportTypes = [
  { value: 1, label: "Trip Cost Report" },
  { value: 2, label: "Per Bag Cost Details" },
  { value: 3, label: "Vehicle Efficiency Details" },
];

function TripCostReportReport() {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [biReport, setBIReport] = useState(false);

  // Get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const reportId = (values) => {
    const typeId = values?.reportType?.value;
    const report_id =
      typeId === 2
        ? `c8aafa76-d1d0-476c-8f83-39819a54af63`
        : typeId === 3
        ? `3a7f6f69-1b3a-4564-8898-a21598556915`
        : "";
    return report_id;
  };

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;

  const parameterValues = (values) => {
    const typeId = values?.reportType?.value;
    const perBagCostDetails = [
      { name: "ShipPointId", value: `${+values?.shipPoint?.value}` },
      { name: "BusinessUnitId", value: `${+buId}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      {
        name: "intDistributionChannel",
        value: `${+values?.channel?.value}`,
      },
      { name: "Regionid", value: `${+values?.region?.value}` },
      { name: "areaid", value: `${+values?.area?.value}` },
      { name: "territoryid", value: `${+values?.territory?.value}` },
      { name: "ReportType", value: `${+values?.reportType?.value}` },
      { name: "intPartid", value: `${+values?.viewType?.value}` },
    ];

    const vehicleEfficiencyDetails = [
      { name: "Shippointid", value: `${+values?.shipPoint?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];

    const params =
      typeId === 2
        ? perBagCostDetails
        : typeId === 3
        ? vehicleEfficiencyDetails
        : [];
    return params;
  };

  const showHandler = (values) => {
    const typeId = values?.reportType?.value;
    setGridData([]);
    if ([1].includes(typeId)) {
      GetTripCostReport_api(
        accId,
        buId,
        values?.fromDate,
        values?.toDate,
        values?.shipPoint?.value,
        setGridData,
        setLoading
      );
    } else if ([2, 3].includes(typeId)) {
      setBIReport(true);
    }
  };

  const disableHandler = (values) => {
    const typeId = values?.reportType?.value;
    return (
      ([2].includes(typeId) && !values?.territory) ||
      !values?.fromDate ||
      !values?.toDate ||
      !values?.shipPoint
    );
  };

  const printRef = useRef();

  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <Card>
            <ModalProgressBar />
            <CardHeader title={"Trip Cost Report"}>
              <CardHeaderToolbar>
                {gridData?.length > 0 && (
                  <ReactToPrint
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary px-4 py-1"
                      >
                        <img
                          style={{
                            width: "25px",
                            paddingRight: "5px",
                          }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                )}
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-12 row m-0 p-0">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={reportTypes}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                            setGridData([]);
                            setBIReport(false);
                          }}
                          placeholder="Report Type"
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={[
                            { value: 0, label: "All" },
                            ...shipPointDDL,
                          ]}
                          value={values?.shipPoint}
                          label="Shippoint"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                            setGridData([]);
                            setBIReport(false);
                          }}
                          placeholder="Shippoint"
                        />
                      </div>

                      {[2].includes(values?.reportType?.value) && (
                        <>
                          <RATForm
                            obj={{
                              values,
                              setFieldValue,
                              onChange: () => {
                                setGridData([]);
                                setBIReport(false);
                              },
                            }}
                          />
                          <div className="col-lg-3">
                            <NewSelect
                              name="viewType"
                              options={[
                                { value: 1, label: "Customer Base" },
                                { value: 2, label: "Territory Base" },
                              ]}
                              value={values?.viewType}
                              label="View Type"
                              onChange={(valueOption) => {
                                setFieldValue("viewType", valueOption);
                                setGridData([]);
                                setBIReport(false);
                              }}
                              placeholder="View Type"
                            />
                          </div>
                        </>
                      )}

                      <FromDateToDateForm
                        obj={{
                          values,
                          setFieldValue,
                          onChange: () => {
                            setGridData([]);
                            setBIReport(false);
                          },
                        }}
                      />

                      <IButton
                        onClick={() => {
                          showHandler(values);
                        }}
                        disabled={disableHandler(values)}
                      />
                    </div>
                  </div>

                  {/* Table */}
                  {[1].includes(values?.reportType?.value) && (
                    <Table
                      obj={{ accId, buId, gridData, values, buName, printRef }}
                    />
                  )}
                  {/* Power BI Reports */}
                  {[2, 3].includes(values?.reportType?.value) && biReport && (
                    <PowerBIReport
                      groupId={groupId}
                      reportId={reportId(values)}
                      parameterValues={parameterValues(values)}
                      parameterPanel={false}
                    />
                  )}
                </Form>
              </>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default TripCostReportReport;
