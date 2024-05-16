/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { getDeliveryReportData } from "../helper";
import { Formik } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import { Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import "../style.css";

// React Pivote Table module Import
import "react-pivottable/pivottable.css";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Loading from "../../../../_helper/_loading";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

function DeliveryReportLanding() {
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
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDeliveryReportData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        setGridData,
        setLoading
      );
    }
  };

  return (
    <>
      <ICustomCard title="Delivery Report">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <div className="flex-fill">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <div className="flex-fill">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                      />
                    </div>
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
                  <div
                    className="pivoteTable-deliveryReport overflow-auto"
                  >
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

export default DeliveryReportLanding;
