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
import { _currentTime } from "../../../../_helper/_currentTime";
import moment from "moment";

const initData = {
  fromDate: _todayDate(),
  fromTime: _currentTime(),
  toDate: _todayDate(),
  toTime: _currentTime(),
  isBillSubmit: "",
};

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

function ShipmentCostReportModified() {
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

  const { profileData, selectedBusinessUnit } = storeData;

  const getReportView = (values) => {
    const fromDateTime = moment(
      `${values?.fromDate} ${values?.fromTime}`
    ).format("YYYY-MM-DDTHH:mm:ss");
    const toDateTime = moment(`${values?.toDate} ${values?.toTime}`).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSalesOrderReportData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        fromDateTime,
        toDateTime,
        values?.isBillSubmit?.value,
        setGridData,
        setLoading
      );
    }
  };

  return (
    <>
      <ICustomCard title="Shipment Cost Report Modified">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-4">
                    <label>From Date and Time</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        type="date"
                        name="fromDate"
                      />
                      <InputField
                        value={values?.fromTime}
                        type="time"
                        name="fromTime"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label>To Date and Time</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        type="date"
                        name="toDate"
                      />
                      <InputField
                        value={values?.toTime}
                        type="time"
                        name="toTime"
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
                  <div style={{ marginTop: "15px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getReportView(values);
                      }}
                      disabled={!values?.fromDate || !values?.toDate}
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

export default ShipmentCostReportModified;
