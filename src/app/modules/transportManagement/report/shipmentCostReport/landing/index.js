/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { getSalesOrderReportData } from "../helper";
import { Formik } from "formik";
import { Form } from "formik";
import "../style.css";

// React Pivote Table module Import
import "react-pivottable/pivottable.css";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  isBillSubmit: "",
  shipPoint: { value: 0, label: "All" },
};

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

function ShipmentCostReport() {
  const [state, setState] = useState();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const getReportView = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSalesOrderReportData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.isBillSubmit?.value,
        values?.shipPoint?.value,
        setGridData,
        setLoading
      );
    }
  };

  return (
    <>
      <ICustomCard title="Shipment Cost Report">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                      value={values?.shipPoint}
                      label="Shippoint"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Shippoint"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                        style={{width: "100%"}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        style={{width: "100%"}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="isBillSubmit"
                      options={[
                        {
                          value: true,
                          label: "Yes",
                        },
                        {
                          value: false,
                          label: "No",
                        },
                      ]}
                      value={values?.isBillSubmit}
                      label="Bill Submit"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("isBillSubmit", valueOption);
                      }}
                      placeholder="Bill Submit"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div
                    style={{ marginTop: "15px" }}
                    className="col-lg text-right"
                  >
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getReportView(values);
                      }}
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.shipPoint ||
                        !values?.isBillSubmit
                      }
                    >
                      View
                    </button>
                  </div>
                </div>

                {gridData?.length > 0 && (
                  <div className="pivoteTable-sales-order-Report overflow-auto">
                    <PivotTableUI
                      data={gridData}
                      onChange={(s) => setState(s)}
                      renderers={Object.assign(
                        {},
                        TableRenderers,
                        PlotlyRenderers
                      )}
                      {...state}
                    />
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default ShipmentCostReport;
